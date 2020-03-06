import { Body, Collisions } from 'detect-collisions'
import React, { useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { HitboxContext, hitboxContext, MetadataBody } from '../services/hitbox'

export const HitboxProvider = (props: { children: React.ReactNode }) => {
  const [ctx] = useState<HitboxContext>(() => ({
    system: new Collisions(),
    metadataBodiesMap: new Map<Body, MetadataBody>(),
  }))
  useFrame(() => {
    // TODO Remove after testing done
    // tslint:disable-next-line: no-console
    console.log('HitboxProvider updating collision system')
    ctx.system.update()
  }, 2)
  return <hitboxContext.Provider value={ctx} children={props.children} />
}
