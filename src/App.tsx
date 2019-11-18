import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import Block from './components/Block'
import CollisionsProvider from './components/CollisionProvider'
import EditorBar from './components/EditorBar'
import PlaneEditor from './components/PlaneEditor'
import Player from './components/Player'
import { LEVEL_LENGTH } from './services/constants'
import useEditorStore from './services/editor'
import useLevelStore from './services/level'
import pickFunc from './services/pickFunc'

export default function App() {
  const items = useLevelStore(state => state.items)
  const {
    addBlock,
    deleteBlock,
    clear,
    loadFromStorage,
    saveToStorage,
  } = useLevelStore(pickFunc)
  useEffect(() => {
    loadFromStorage()
    window.addEventListener('unload', () => saveToStorage())
  }, [])
  const tool = useEditorStore(state => state.tool)
  const editorEnabled = useEditorStore(state => state.enabled)
  const sliderScroll = useEditorStore(state => state.cameraScroll)
  const [cameraProps, setCamera] = useSpring(() => ({
    position: [0, 0, 0] as any,
    config: { tension: 200, friction: 40 },
  }))
  useEffect(() => {
    setCamera({
      position: [-sliderScroll * LEVEL_LENGTH, 0, 0],
    } as any)
  }, [sliderScroll])
  return (
    <>
      <EditorBar onCleanLevel={clear} />
      <Canvas
        onCreated={({ gl }) => {
          gl.gammaInput = true
          gl.gammaOutput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
        }}
        camera={{ position: [0, 0, 10] }}
      >
        <a.scene {...cameraProps}>
          <pointLight />
          <ambientLight />
          <PlaneEditor
            onClick={({ point }) => {
              const [x, y] = [
                Math.round(
                  point.x -
                    (cameraProps.position as any).payload[0].value -
                    0.5,
                ),
                Math.round(
                  point.y -
                    (cameraProps.position as any).payload[1].value -
                    0.5,
                ),
              ]
              if (editorEnabled && tool === 'pencil') {
                addBlock({ x, y })
              } else if (editorEnabled && tool === 'eraser') {
                deleteBlock({ x, y })
              }
            }}
          />
          <CollisionsProvider>
            <Player id={0} xInit={-4} yInit={-2} />
            {items.map(({ x, y }) => (
              <Block key={`${x}${y}`} x={x} y={y} />
            ))}
          </CollisionsProvider>
        </a.scene>
      </Canvas>
    </>
  )
}
