import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { PerspectiveCamera } from 'three'

export const Camera = () => {
  const camera = useRef<PerspectiveCamera>()
  const { size, setDefaultCamera } = useThree()
  useEffect(() => {
    if (camera.current) {
      setDefaultCamera(camera.current)
    }
  }, [])
  useFrame(() => {
    if (camera.current) {
      camera.current.updateMatrixWorld()
    }
  })
  return (
    <perspectiveCamera
      ref={camera}
      position={[0, 0, 23]}
      fov={35}
      aspect={size.width / size.height}
      onUpdate={self => self.updateProjectionMatrix()}
    />
  )
}
