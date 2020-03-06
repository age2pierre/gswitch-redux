import React, { useEffect, useState } from 'react'
import { Canvas, Dom } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { OrbitController } from './OrbitController'
import { HitboxProvider } from './HitboxProvider'
import { useHitboxBody } from '../services/hitbox'
import { Cube } from './Block'

const Box = (props: { name: string }) => {
  useHitboxBody({
    bodyDef: {
      type: 'Polygon',
    },
    metadata: {
      tags: ['STATIC', props.name],
    },
    onBeforeUpdate: () => {
      // tslint:disable-next-line: no-console
      console.log(`Box${props.name} onBeforeUpdate`)
    },
    onAfterUpdate: () => {
      // tslint:disable-next-line: no-console
      console.log(`Box${props.name} onAfterUpdate`)
    },
  })

  return <Cube />
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
      <OrbitController />
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
        position={[-2, 2, 0]}
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
      {isRunning ? (
        <HitboxProvider>
          <Box key="A" name="A" />
          <Box key="B" name="B" />
        </HitboxProvider>
      ) : null}
    </Canvas>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Test
