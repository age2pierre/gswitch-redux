import { Body, Circle, Collisions, Polygon } from 'detect-collisions'
import { useContext, useEffect, useState, createContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { exhaustiveCheck } from './exhaustiveCheck'

export interface MetadataBody {
  id: symbol
  tags: string[]
}
export interface HitboxContext {
  system: Collisions
  metadataBodiesMap: Map<Body, MetadataBody>
}

interface PolygonDef {
  type: 'Polygon'
  x?: number
  y?: number
  points?: number[][]
  angle?: number
  scale_x?: number
  scale_y?: number
  padding?: number
}

interface CircleDef {
  type: 'Circle'
  x?: number
  y?: number
  radius?: number
  scale?: number
  padding?: number
}

interface HitboxHookOptions {
  bodyDef: PolygonDef | CircleDef
  metadata: Omit<MetadataBody, 'id'>
  onBeforeUpdate: (body: Body, ctx: HitboxContext) => void
  onAfterUpdate: (body: Body, ctx: HitboxContext) => void
}

export const hitboxContext = createContext<HitboxContext>({
  system: new Collisions(),
  metadataBodiesMap: new Map<Body, MetadataBody>(),
})

export const useHitboxBody = (options: HitboxHookOptions) => {
  const ctx = useContext(hitboxContext)
  // create collision body based on definition
  const [body] = useState<Body>(() => {
    const { type, x, y, padding } = options.bodyDef
    switch (type) {
      case 'Polygon':
        const {
          points,
          angle,
          scale_x,
          scale_y,
        } = options.bodyDef as PolygonDef
        return new Polygon(
          x ?? 0,
          y ?? 0,
          points ?? [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ],
          angle ?? 0,
          scale_x ?? 1,
          scale_y ?? 1,
          padding ?? 0,
        )
      case 'Circle':
        const { radius, scale } = options.bodyDef as CircleDef
        return new Circle(
          x ?? 0,
          y ?? 0,
          radius ?? 0.5,
          scale ?? 1,
          padding ?? 0,
        )
      default:
        exhaustiveCheck(type)
    }
  })

  useEffect(() => {
    ctx.system.insert(body)
    ctx.metadataBodiesMap.set(body, {
      id: Symbol('HitboxID'),
      ...options.metadata,
    })

    return () => {
      ctx.system.remove(body)
      ctx.metadataBodiesMap.delete(body)
    }
  }, [])

  useFrame(() => {
    options.onBeforeUpdate(body, ctx)
  }, 1)

  useFrame(() => {
    options.onAfterUpdate(body, ctx)
  }, 3)
}
