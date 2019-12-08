import range from 'lodash-es/range'
import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import useLevelStore from '../services/level'
import pickFunc from '../services/pickFunc'
import useRaceStore from '../services/race'
import Block from './Block'
import Camera from './Camera'
import CollisionsProvider from './CollisionProvider'
import Player from './Player'

const CameraRig = () => {
  const [cameraProps, setCamera] = useSpring(() => ({
    position: [0, 0, 0] as any,
    config: { tension: 200, friction: 40 },
  }))
  const scroll = useRaceStore(state => state.cameraScroll)
  useEffect(() => {
    setCamera({
      position: [scroll, 0, 0] as any,
    })
  }, [scroll])
  return (
    <a.group {...cameraProps}>
      <Camera />
      <pointLight position={[0, 0, 5]} />
    </a.group>
  )
}

export default function Game() {
  const items = useLevelStore(state => state.items)
  const { loadFromStorage } = useLevelStore(pickFunc)
  useEffect(() => {
    loadFromStorage()
  }, [])

  const numberPlayer = useRaceStore(state => state.config.numberPlayer)
  const phase = useRaceStore(state => state.phase)
  const { updateCameraOnFrame } = useRaceStore(pickFunc)

  useFrame((_, delta) => {
    updateCameraOnFrame(delta)
  })

  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.gammaInput = true
        gl.gammaOutput = true
        gl.toneMapping = THREE.Uncharted2ToneMapping
      }}
    >
      <CameraRig />
      <ambientLight />
      <CollisionsProvider>
        {phase !== 'SELECT_MENU'
          ? range(0, numberPlayer).map(id => <Player key={id} id={id} />)
          : null}
        {items.map(({ x, y }) => (
          <Block key={`${x}${y}`} x={x} y={y} />
        ))}
      </CollisionsProvider>
    </Canvas>
  )
}
