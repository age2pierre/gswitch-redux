import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { Canvas } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { LEVEL_LENGTH, PLAYER_STARTING_POINTS } from '../services/constants'
import { useEditorStore } from '../services/editor'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { Block } from './Block'
import { Camera } from './Camera'
import { Dummy } from './Dummy'
import { EditorBar } from './EditorBar'
import { PlaneEditor } from './PlaneEditor'

export const Editor = () => {
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
    window.addEventListener('unload', () => saveToStorage(undefined))
  }, [])
  const tool = useEditorStore(state => state.tool)
  const sliderScroll = useEditorStore(state => state.cameraScroll)
  const [cameraProps, setCamera] = useSpring(() => ({
    position: [0, 0, 0] as any,
    config: { tension: 200, friction: 40 },
  }))
  useEffect(() => {
    setCamera({
      position: [sliderScroll * LEVEL_LENGTH, 0, 0],
    } as any)
  }, [sliderScroll])
  return (
    <>
      <EditorBar onCleanLevel={clear} />
      <Canvas
        onCreated={({ gl }) => {
          gl.outputEncoding = GammaEncoding
          gl.toneMapping = Uncharted2ToneMapping
        }}
      >
        <a.group {...cameraProps}>
          <Camera />
        </a.group>
        <pointLight position={[5, 5, 5]} />
        <ambientLight />
        <PlaneEditor
          onClick={({ point }) => {
            const [x, y] = [
              Math.round(point.x - 0.5),
              Math.round(point.y - 0.5),
            ]
            if (tool === 'pencil') {
              addBlock({ x, y })
            } else if (tool === 'eraser') {
              deleteBlock({ x, y })
            }
          }}
        />
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
