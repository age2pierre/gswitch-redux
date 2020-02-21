import { Collisions } from 'detect-collisions'
import React, { useState } from 'react'
import { context } from '../services/collisions'

export const CollisionsProvider = (props: { children: React.ReactNode }) => {
  const [system] = useState<Collisions>(() => new Collisions())
  // useFrame(() => system.update())
  return <context.Provider value={system} children={props.children} />
}
