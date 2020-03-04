import React, { useRef } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

export const OrbitController = () => {
  const orbitCtrlRef = useRef<OrbitControls>()
  const { camera, gl } = useThree()
  useFrame(() => orbitCtrlRef.current?.update())
  return (
    <orbitControls
      ref={orbitCtrlRef}
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.5}
    />
  )
}
