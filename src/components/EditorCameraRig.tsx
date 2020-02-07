import React, { useEffect } from 'react'
import { a, useSpring } from 'react-spring/three'
import { LEVEL_LENGTH } from '../services/constants'
import { useEditorStore } from '../services/editor'
import { Camera } from './Camera'

export const EditorCameraRig = () => {
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
    <a.group {...cameraProps}>
      <Camera />
    </a.group>
  )
}
