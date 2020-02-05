import { isEqual, uniqWith } from 'lodash-es'
import create from 'zustand'

export interface Block {
  x: number
  y: number
}

export interface LevelStore {
  items: Block[]
  addBlock: (args: Block) => void
  deleteBlock: (args: Block) => void
  clear: () => void
  loadFromStorage: (level?: string) => void
  saveToStorage: (level?: string) => void
}

const [useLevelStore, apiLevelStore] = create<LevelStore>((set, get) => {
  const store: LevelStore = {
    items: [],
    addBlock({ x, y }) {
      set(state => ({
        ...state,
        items: uniqWith<Block>([...state.items, { x, y }], isEqual),
      }))
    },
    deleteBlock({ x, y }) {
      set(state => ({
        ...state,
        items: state.items.filter(item => !(item.x === x && item.y === y)),
      }))
    },
    clear() {
      set(state => ({
        ...state,
        items: [],
      }))
    },
    loadFromStorage(level = 'default_level') {
      const str = window.localStorage.getItem(level)
      if (!str) {
        return
      }
      const items = JSON.parse(str)
      if (!items) {
        return
      }
      set(state => ({
        ...state,
        items,
      }))
    },
    saveToStorage(level = 'default_level') {
      window.localStorage.setItem(level, JSON.stringify(get().items))
    },
  }
  return store
})

export { useLevelStore, apiLevelStore }
