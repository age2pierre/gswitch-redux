import React, { useRef } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { Dummy } from './Dummy'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })

export function Controls() {
  const ref = useRef<OrbitControls>()
  const { camera, gl } = useThree()
  useFrame(() => ref.current?.update())
  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      enableDamping={true}
      dampingFactor={0.1}
      rotateSpeed={0.5}
    />
  )
}

export const Test = () => {
  return (
    <Canvas>
      <Controls />
      <gridHelper args={[20, 20, 0x880000]} rotation={[Math.PI / 2, 0, 0]} />
      <pointLight position={[0, 0, 5]} />
      <Dummy
        x={0}
        y={0}
        gravity={'down'}
        animation={'idle'}
        ctrlKey={'X'}
        color={'orange'}
      />
    </Canvas>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Test
