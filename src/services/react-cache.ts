import * as Scheduler from 'scheduler'

// Intentionally not named imports because Rollup would
// use dynamic dispatch for CommonJS interop named imports.
const {
  unstable_scheduleCallback: scheduleCallback,
  unstable_IdlePriority: IdlePriority,
} = Scheduler

interface Entry<T> {
  value: T
  onDelete: () => any
  previous: Entry<T>
  next: Entry<T>
}

export function createLRU<T>(limit: number) {
  let LIMIT = limit

  // Circular, doubly-linked list
  let first: Entry<T> | null = null
  let size: number = 0

  let cleanUpIsScheduled: boolean = false

  function scheduleCleanUp() {
    if (cleanUpIsScheduled === false && size > LIMIT) {
      // The cache size exceeds the limit. Schedule a callback to delete the
      // least recently used entries.
      cleanUpIsScheduled = true
      scheduleCallback(IdlePriority, cleanUp)
    }
  }

  function cleanUp() {
    cleanUpIsScheduled = false
    deleteLeastRecentlyUsedEntries(LIMIT)
  }

  function deleteLeastRecentlyUsedEntries(targetSize: number) {
    // Delete entries from the cache, starting from the end of the list.
    if (first !== null) {
      const resolvedFirst = first
      let last: Entry<T> | null = resolvedFirst.previous
      while (size > targetSize && last !== null) {
        const onDelete = last.onDelete
        const previous: Entry<T> = last.previous
        last.onDelete = null as any

        // Remove from the list
        last.previous = last.next = null as any
        if (last === first) {
          // Reached the head of the list.
          first = last = null
        } else {
          ;(first as any).previous = previous
          previous.next = first as any
          last = previous
        }

        size -= 1

        // Call the destroy method after removing the entry from the list. If it
        // throws, the rest of cache will not be deleted, but it will be in a
        // valid state.
        onDelete()
      }
    }
  }

  function add(value: T, onDelete: () => any): Entry<T> {
    const entry = {
      value,
      onDelete,
      next: null as any,
      previous: null as any,
    }
    if (first === null) {
      entry.previous = entry.next = entry
      first = entry
    } else {
      // Append to head
      const last = first.previous
      last.next = entry
      entry.previous = last

      first.previous = entry
      entry.next = first

      first = entry
    }
    size += 1
    return entry
  }

  function update(entry: Entry<T>, newValue: T): void {
    entry.value = newValue
  }

  function access(entry: Entry<T>): T {
    const next = entry.next
    if (next !== null) {
      // Entry already cached
      const resolvedFirst: Entry<T> = first as any
      if (first !== entry) {
        // Remove from current position
        const previous = entry.previous
        previous.next = next
        next.previous = previous

        // Append to head
        const last = resolvedFirst.previous
        last.next = entry
        entry.previous = last

        resolvedFirst.previous = entry
        entry.next = resolvedFirst

        first = entry
      }
    } else {
      // Cannot access a deleted entry
      // TODO: Error? Warning?
    }
    scheduleCleanUp()
    return entry.value
  }

  function setLimit(newLimit: number) {
    LIMIT = newLimit
    scheduleCleanUp()
  }

  return { add, update, access, setLimit }
}

interface Thenable<T> {
  then(resolve: (arg: T) => any, reject: (arg: any) => any): any
}

interface Suspender {
  then(resolve: () => any, reject: () => any): any
}

interface PendingResult {
  status: 0
  value: Suspender
}

interface ResolvedResult<V> {
  status: 1
  value: V
}

interface RejectedResult {
  status: 2
  value: any
}

type Result<V> = PendingResult | ResolvedResult<V> | RejectedResult

interface Resource<I, V> {
  read(arg: I): V
  preload(arg: I): void
}

const Pending = 0
const Resolved = 1
const Rejected = 2

function identityHashFn<I>(input: I): I {
  return input
}

const CACHE_LIMIT = 500
const lru = createLRU(CACHE_LIMIT)
const entries = new Map<Resource<any, any>, Map<any, any>>()

function accessResult<I, K, V>(
  resource: any,
  fetch: (arg: I) => Thenable<V>,
  input: I,
  key: K,
): Result<V> {
  let entriesForResource = entries.get(resource)
  if (entriesForResource === undefined) {
    entriesForResource = new Map()
    entries.set(resource, entriesForResource)
  }
  const entry = entriesForResource.get(key)
  if (entry === undefined) {
    const thenable = fetch(input)
    thenable.then(
      value => {
        if (newResult.status === Pending) {
          const resolvedResult: ResolvedResult<V> = newResult as any
          resolvedResult.status = Resolved
          resolvedResult.value = value
        }
      },
      error => {
        if (newResult.status === Pending) {
          const rejectedResult: RejectedResult = newResult as any
          rejectedResult.status = Rejected
          rejectedResult.value = error
        }
      },
    )
    const newResult: PendingResult = { status: Pending, value: thenable }
    const newEntry = lru.add(newResult, deleteEntry.bind(null, resource, key))
    entriesForResource.set(key, newEntry)
    return newResult
  } else {
    return lru.access(entry) as any
  }
}

function deleteEntry(resource: any, key: any): void {
  const entriesForResource = entries.get(resource)
  if (entriesForResource !== undefined) {
    entriesForResource.delete(key)
    if (entriesForResource.size === 0) {
      entries.delete(resource)
    }
  }
}

export function unstable_createResource<I, K extends string | number, V>(
  fetch: (arg: I) => Thenable<V>,
  maybeHashInput?: (arg: I) => K,
) {
  const hashInput =
    maybeHashInput !== undefined ? maybeHashInput : identityHashFn

  const resource = {
    read(input: I) {
      const result = accessResult(resource, fetch, input, hashInput(input))
      switch (result.status) {
        case Resolved:
          return result.value
        case Pending:
        case Rejected:
          throw result.value
        default:
          return undefined
      }
    },
  }
  return resource
}

export function unstable_setGlobalCacheLimit(limit: number) {
  lru.setLimit(limit)
}
