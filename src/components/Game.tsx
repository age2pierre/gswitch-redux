import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import useLevelStore from '../services/level'
import pickFunc from '../services/pickFunc'
import Block from './Block'
import CollisionsProvider from './CollisionProvider'
import Player from './Player'

const PLAYER_ID = [0, 1, 2, 3, 4, 5] as const

export default function Game() {
  const items = useLevelStore(state => state.items)
  const { loadFromStorage } = useLevelStore(pickFunc)
  useEffect(() => {
    loadFromStorage()
  }, [])
  const [cameraProps, setCamera] = useSpring(() => ({
    position: [0, 0, 0] as any,
    config: { tension: 200, friction: 40 },
  }))
  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.gammaInput = true
        gl.gammaOutput = true
        gl.toneMapping = THREE.Uncharted2ToneMapping
      }}
      camera={{ position: [0, 0, 23], fov: 35 }}
    >
      <a.scene {...cameraProps}>
        <pointLight position={[0, 0, 5]} />
        <ambientLight />
        <CollisionsProvider>
          {PLAYER_ID.map(id => (
            <Player key={id} id={id} />
          ))}
          {items.map(({ x, y }) => (
            <Block key={`${x}${y}`} x={x} y={y} />
          ))}
        </CollisionsProvider>
      </a.scene>
    </Canvas>
  )
}
