import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import { LEVEL_LENGTH, PLAYER_STARTING_POINTS } from '../services/constants'
import useEditorStore from '../services/editor'
import useLevelStore from '../services/level'
import pickFunc from '../services/pickFunc'
import Block from './Block'
import Dummy from './Dummy'
import EditorBar from './EditorBar'
import PlaneEditor from './PlaneEditor'

export default function Editor() {
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
        camera={{ position: [0, 0, 23], fov: 35 }}
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
              if (tool === 'pencil') {
                addBlock({ x, y })
              } else if (tool === 'eraser') {
                deleteBlock({ x, y })
              }
            }}
          />
          {PLAYER_STARTING_POINTS.map(([x, y], index) => (
            <Dummy
              key={index}
              x={x}
              y={y}
              animation={'idle'}
              gravity={'down'}
            />
          ))}
          {items.map(({ x, y }) => (
            <Block key={`${x}${y}`} x={x} y={y} />
          ))}
        </a.scene>
      </Canvas>
    </>
  )
}
