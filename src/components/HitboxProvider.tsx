import { Body, Collisions } from 'detect-collisions'
import React, { useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { HitboxContext, hitboxContext, MetadataBody } from '../services/hitbox'

export const HitboxProvider = (props: { children: React.ReactNode }) => {
  const [ctx] = useState<HitboxContext>(() => ({
    system: new Collisions(),
    metadataBodiesMap: new Map<Body, MetadataBody>(),
  }))
  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 0)
  useFrame(() => {
    ctx.system.update()
  }, 20)
  return <hitboxContext.Provider value={ctx} children={props.children} />
}
