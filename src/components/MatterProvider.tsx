import { Engine, World } from 'matter-js'
import React, { useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { matterContext } from '../services/matter'

export const MatterProvider = (props: { children: React.ReactNode }) => {
  const [ctx] = useState(() => {
    const world = World.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
    })
    const engine = Engine.create({
      world,
    })
    return {
      engine,
      world,
    }
  })
  // Run physic simulation stepper every frame
  useFrame((_, delta) => {
    Engine.update(ctx.engine, delta)
  })
  return <matterContext.Provider value={ctx} children={props.children} />
}
