import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { PLAYER_STARTING_POINTS } from '../services/constants'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { Block } from './Block'
import { Dummy } from './Dummy'
import { EditorBarContainer } from './EditorBarContainer'
import { EditorCameraRig } from './EditorCameraRig'
import { PlaneEditorContainer } from './PlaneEditorContainer'

export const Editor = () => {
  const items = useLevelStore(state => state.items)
  const { loadFromStorage, saveToStorage } = useLevelStore(pickFunc)
  useEffect(() => {
    loadFromStorage()
    window.addEventListener('unload', () => saveToStorage(undefined))
  }, [])

  return (
    <>
      <EditorBarContainer />
      <Canvas
        onCreated={({ gl }) => {
          gl.outputEncoding = GammaEncoding
          gl.toneMapping = Uncharted2ToneMapping
        }}
      >
        <EditorCameraRig />
        <PlaneEditorContainer />

        <pointLight position={[5, 5, 5]} />
        <ambientLight />

        {PLAYER_STARTING_POINTS.map(([x, y], index) => (
          <Dummy key={index} x={x} y={y} animation={'idle'} gravity={'down'} />
        ))}
        {items.map(({ x, y }) => (
          <Block key={`block_${x}_${y}`} x={x} y={y} />
        ))}
      </Canvas>
    </>
  )
}
