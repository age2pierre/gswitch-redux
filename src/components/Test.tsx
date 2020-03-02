import React, { useEffect, useRef, useState } from 'react'
import { Canvas, Dom, extend, useFrame, useThree } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Robot } from './Robot'

extend({ OrbitControls })

export function Controls() {
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

export const Test = () => {
  const [isRunning, setRunning] = useState(false)
  useEffect(() => {
    ;(window as any).toggle = () => setRunning(!isRunning)
  })
  return (
    <Canvas
      concurrent={true}
      onCreated={({ gl }) => {
        gl.outputEncoding = GammaEncoding
        gl.toneMapping = Uncharted2ToneMapping
      }}
    >
      <Controls />
      <gridHelper args={[20, 20, 0x880000]} rotation={[Math.PI / 2, 0, 0]} />
      <spotLight
        angle={Math.PI / 3}
        castShadow={true}
        shadowMapHeight={2048}
        shadowMapWidth={2048}
        position={[0, 18, 18]}
        intensity={1}
      />
      <Dom
        position={[-1.5, 0.75, 0]}
        center={true}
        prepend={true}
        style={{
          padding: 3,
          width: 70,
          height: 70,
          color: 'orangered',
          borderRadius: 7,
          border: '3px solid orangered',
          background: 'rgb(26, 26, 26)',
        }}
      >
        <div>{isRunning ? 'Running' : 'Idle'}</div>
      </Dom>
      <React.Suspense fallback={null}>
        <Robot
          mainColor={'orangered'}
          targetAnimation={isRunning ? 'Robot_Running' : 'Robot_Idle'}
        />
      </React.Suspense>
      <group position={[2, 0, 0]}>
        <React.Suspense fallback={null}>
          <Robot
            mainColor={'lime'}
            targetAnimation={isRunning ? 'Robot_Idle' : 'Robot_Running'}
          />
        </React.Suspense>
      </group>
    </Canvas>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Test
