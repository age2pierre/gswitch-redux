import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import Block from './components/Block'
import CollisionsProvider from './components/CollisionProvider'
import EditorBar from './components/EditorBar'
import PlaneEditor from './components/PlaneEditor'
import Player from './components/Player'
import useLevelStore from './services/level'
import pickFunc from './services/pickFunc'

export default function App() {
  const items = useLevelStore(state => state.items)
  const { addBlock, clear, loadFromStorage, saveToStorage } = useLevelStore(
    pickFunc,
  )
  useEffect(() => {
    loadFromStorage()
    window.addEventListener('unload', () => saveToStorage())
  }, [])
  return (
    <>
      <EditorBar onClear={clear} />
      <Canvas
        camera={{ position: [0, 0, 10] }}
        onCreated={({ gl }) => {
          gl.gammaInput = true
          gl.gammaOutput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
        }}
      >
        <CollisionsProvider>
          <pointLight />
          <ambientLight />>
          <Player id={0} xInit={0} yInit={0} />
          <PlaneEditor onClick={({ point: { x, y } }) => addBlock({ x, y })} />
          {items.map(({ x, y }) => (
            <Block
              key={`${x}${y}`}
              x={Math.round(x - 0.5)}
              y={Math.round(y - 0.5)}
            />
          ))}
        </CollisionsProvider>
      </Canvas>
    </>
  )
}
