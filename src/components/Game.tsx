import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { Block } from './Block'
import { Camera } from './Camera'
import { CollisionsProvider } from './CollisionProvider'
import { Player } from './Player'
import { PLAYERS } from '../services/constants'

export const Game = () => {
  const items = useLevelStore(state => state.items)
  const { loadFromStorage } = useLevelStore(pickFunc)
  useEffect(() => {
    loadFromStorage()
  }, [])
  const [cameraProps] = useSpring(() => ({
    position: [0, 0, 0] as any,
    config: { tension: 200, friction: 40 },
  }))
  return (
    <Canvas
      concurrent={true}
      onCreated={({ gl }) => {
        gl.outputEncoding = GammaEncoding
        gl.toneMapping = Uncharted2ToneMapping
      }}
    >
      <a.group {...cameraProps}>
        <Camera />
        <pointLight position={[0, 0, 5]} intensity={0.9} />
      </a.group>
      <ambientLight intensity={0.1} />
      <CollisionsProvider>
        {PLAYERS.map((p, i) => (
          <Player key={p.name} id={i} />
        ))}
        {items.map(({ x, y }) => (
          <Block key={`${x}${y}`} x={x} y={y} />
        ))}
      </CollisionsProvider>
    </Canvas>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Game
