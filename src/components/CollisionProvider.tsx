import { Collisions } from 'detect-collisions'
import React, { FunctionComponent, useState } from 'react'
import { context } from '../services/collisions'

const CollisionsProvider: FunctionComponent<{}> = ({ children }) => {
  const [system] = useState<Collisions>(() => new Collisions())
  // useFrame(() => system.update())
  return <context.Provider value={system} children={children} />
}

export default CollisionsProvider
