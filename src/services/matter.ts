import {
  Body,
  Engine,
  IBodyDefinition,
  World,
  Events,
  IEventCollision,
} from 'matter-js'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { useFrame } from 'react-three-fiber'
import { Object3D } from 'three'

export interface MatterContext {
  world: World
  engine: Engine
}

export const matterContext = createContext<MatterContext>({
  engine: Engine.create(),
  world: World.create({}),
})

export interface MatterHooksOptions {
  bodyDef: IBodyDefinition
  xOffset?: number
  yOffset?: number
  onFrame?: (body: Body, engine: Engine) => void
  onCollisionStart?: (
    e: IEventCollision<Engine>,
    body: Body,
    engine: Engine,
  ) => void
  collisionStartDeps?: any[]
  onCollisionEnd?: (
    e: IEventCollision<Engine>,
    body: Body,
    engine: Engine,
  ) => void
  collisionEndDeps?: any[]
  onEffect?: (body: Body, engine: Engine) => void
  effectDeps?: any[]
}

/**
 * Hook to maintain a world object in sync with a physic object.
 * It will copy Matter properties posX, posY and rotZ to Three object on everyframe.
 */
export const useMatter = (options: MatterHooksOptions) => {
  // retrieve matterjs world and engine from context
  const { world, engine } = useContext(matterContext)

  // create body and add it to the world
  const [body] = useState(() => Body.create(options.bodyDef))
  useEffect(() => {
    World.add(world, body)
    return () => void World.remove(world, body)
  }, [])

  // collision start event handler
  const collisionStartCallback = useCallback((e: IEventCollision<Engine>) => {
    const pair = e.pairs.find(p => p.bodyA === body || p.bodyB === body)
    if (pair != null) {
      if (options.onCollisionStart != null) {
        options.onCollisionStart(e, body, engine)
      }
    }
  }, options.collisionStartDeps ?? [])
  useEffect(() => {
    Events.on(engine, 'collisionStart', collisionStartCallback)
    return Events.off(engine, 'collisionStart', collisionStartCallback)
  }, [collisionStartCallback])

  // collision end event handler
  const collisionEndCallback = useCallback((e: IEventCollision<Engine>) => {
    const pair = e.pairs.find(p => p.bodyA === body || p.bodyB === body)
    if (pair != null) {
      if (options.onCollisionEnd != null) {
        options.onCollisionEnd(e, body, engine)
      }
    }
  }, options.collisionEndDeps ?? [])
  useEffect(() => {
    Events.on(engine, 'collisionEnd', collisionEndCallback)
    return Events.off(engine, 'collisionEnd', collisionEndCallback)
  }, [collisionStartCallback])

  // extra side effects handler
  useEffect(() => {
    if (options.onEffect != null) {
      options.onEffect(body, engine)
    }
  }, options.effectDeps ?? [])

  // raf event handler
  const ref = useRef<Object3D>()
  useFrame(() => {
    // update three js objet pos and angle
    if (ref.current) {
      ref.current.position.x = body.position.x + (options.xOffset ?? 0)
      ref.current.position.y = body.position.y + (options.yOffset ?? 0)
      ref.current.rotation.z = body.angle
    }
    // extra callback
    if (options.onFrame) {
      options.onFrame(body, engine)
    }
  })

  return ref
}

/**
 * Hook to maintain a world object in sync with a physic object.
 * Similar to __useMatter__ but doesn't update Three object (hence no ref returned).
 */
export const useStaticMatter = (
  options: Omit<MatterHooksOptions, 'onFrame' | 'xOffset' | 'yOffset'>,
) => {
  // retrieve matterjs world and engine from context
  const { world, engine } = useContext(matterContext)
  // create body and add it to the world
  const [body] = useState(() =>
    Body.create({ ...options.bodyDef, isStatic: true }),
  )
  useEffect(() => {
    World.add(world, body)
    return () => void World.remove(world, body)
  }, [])

  // collision start event handler
  const collisionStartCallback = useCallback((e: IEventCollision<Engine>) => {
    const pair = e.pairs.find(p => p.bodyA === body || p.bodyB === body)
    if (pair != null) {
      if (options.onCollisionStart != null) {
        options.onCollisionStart(e, body, engine)
      }
    }
  }, options.collisionStartDeps ?? [])
  useEffect(() => {
    Events.on(engine, 'collisionStart', collisionStartCallback)
    return Events.off(engine, 'collisionStart', collisionStartCallback)
  }, [collisionStartCallback])

  // collision end event handler
  const collisionEndCallback = useCallback((e: IEventCollision<Engine>) => {
    const pair = e.pairs.find(p => p.bodyA === body || p.bodyB === body)
    if (pair != null) {
      if (options.onCollisionEnd != null) {
        options.onCollisionEnd(e, body, engine)
      }
    }
  }, options.collisionEndDeps ?? [])
  useEffect(() => {
    Events.on(engine, 'collisionEnd', collisionEndCallback)
    return Events.off(engine, 'collisionEnd', collisionEndCallback)
  }, [collisionStartCallback])

  // extra side effects handler
  useEffect(() => {
    if (options.onEffect != null) {
      options.onEffect(body, engine)
    }
  }, options.effectDeps ?? [])
}
