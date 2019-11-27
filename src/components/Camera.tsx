import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { PerspectiveCamera } from 'three'

const Camera: FunctionComponent<{}> = () => {
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

export default Camera
