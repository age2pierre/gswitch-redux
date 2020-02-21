import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { PLAYERS } from '../services/constants'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { Block } from './Block'
import { Dummy } from './Dummy'
import { EditorBarContainer } from './EditorBarContainer'
import { EditorCameraRig } from './EditorCameraRig'
import { PlaneEditorContainer } from './PlaneEditorContainer'
import { useHistory } from 'react-router-dom'

export const Editor = () => {
  const items = useLevelStore(state => state.items)
  const { loadFromStorage, saveToStorage } = useLevelStore(pickFunc)
  const history = useHistory()
  useEffect(() => {
    loadFromStorage()
    history.listen(() => saveToStorage(undefined))
  }, [])

  return (
    <>
      <EditorBarContainer />
      <Canvas
        shadowMap={true}
        onCreated={({ gl }) => {
          gl.outputEncoding = GammaEncoding
          gl.toneMapping = Uncharted2ToneMapping
        }}
      >
        <EditorCameraRig />
        <PlaneEditorContainer />
        <ambientLight intensity={0.1} />
        {Object.values(PLAYERS).map(p => (
          <Dummy
            key={p.name}
            x={p.startPoint[0]}
            y={p.startPoint[1]}
            color={p.color}
            ctrlKey={p.name}
            animation="idle"
            gravity="down"
          />
        ))}
        {items.map(({ x, y }) => (
          <Block key={`block_${x}_${y}`} x={x} y={y} />
        ))}
      </Canvas>
    </>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Editor
