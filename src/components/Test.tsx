import { Body } from 'matter-js'
import React, { useEffect, useState } from 'react'
import { Canvas, Dom } from 'react-three-fiber'
import { GammaEncoding, Uncharted2ToneMapping } from 'three'
import { useMatter, useStaticMatter } from '../services/matter'
import { Cube } from './Block'
import { MatterProvider } from './MatterProvider'
import { OrbitController } from './OrbitController'

const StaticBlock = (props: {
  w: number
  h: number
  x: number
  y: number
  name?: string
}) => {
  const { h: _h, w: _w, y: _y, x: _x } = props
  useStaticMatter({
    bodyDef: {
      vertices: [
        { x: _x, y: _y },
        { x: _x + _w, y: _y },
        { x: _x + _w, y: _y + _h },
        { x: _x, y: _y + _h },
      ],
      position: { x: _x + _w / 2, y: _y + _h / 2 },
      density: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      restitution: 0,
      label: 'block',
    },
  })

  return (
    <Cube
      width={props.w}
      height={props.h}
      position={[_x + _w / 2, _y + _h / 2, 0]}
    />
  )
}

const MovingBlock = (props: {
  initX: number
  initY: number
  isMoving: boolean
  isGravityDown: boolean
}) => {
  const { isMoving, isGravityDown, initX, initY } = props
  const ref = useMatter({
    bodyDef: {
      position: { x: initX + 0.5, y: initY + 0.5 },
      vertices: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ],
      density: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      restitution: 0,
      label: 'player',
    },
    onEffect: (body, engine) => {
      if (isMoving) {
        Body.setVelocity(body, { x: 0.01, y: isGravityDown ? -0.01 : 0.01 })
      } else {
        Body.setVelocity(body, { x: 0, y: 0 })
      }
    },
    effectDeps: [isMoving, isGravityDown],
  })
  return <Cube width={1} height={1} ref={ref} />
}

export const Test = () => {
  const [isRunning, setRunning] = useState(false)
  const [gravityDown, switchGravity] = useState(true)
  useEffect(() => {
    ;(window as any).toggle = () => setRunning(!isRunning)
    ;(window as any).switch = () => switchGravity(!gravityDown)
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
      <MatterProvider>
        <StaticBlock w={8} x={0} y={0} h={1} name="Floor" />
        <MovingBlock
          initX={0}
          initY={5}
          isMoving={isRunning}
          isGravityDown={gravityDown}
        />
      </MatterProvider>
    </Canvas>
  )
}

// Named export doesn't work for lazy loading
// tslint:disable-next-line: no-default-export
export default Test
