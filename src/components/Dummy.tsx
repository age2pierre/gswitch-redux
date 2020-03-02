import React from 'react'
import { Capsule } from './Capsule'
import { Robot } from './Robot'
import { Dom } from 'react-three-fiber'

export interface DummyProps {
  x: number
  y: number
  gravity: 'up' | 'down'
  animation: 'idle' | 'running'
  ctrlKey: string
  color: string
}

export const Dummy = (props: DummyProps) => {
  return (
    <group position={[props.x, props.y, 0]}>
      <React.Suspense
        fallback={<Capsule x={-0.5} y={0.25} color={props.color} />}
      >
        <Robot
          mainColor={props.color}
          targetAnimation={
            props.animation === 'running' ? 'Robot_Running' : 'Robot_Idle'
          }
        />
      </React.Suspense>
      <Dom
        position={[-1.5, 0.75, 0]}
        center={true}
        style={{
          padding: 3,
          width: 70,
          height: 70,
          color: props.color,
          borderRadius: 7,
          border: `3px solid ${props.color}`,
          background: 'rgb(26, 26, 26)',
        }}
      >
        <div>
          <div>{props.ctrlKey}</div>
          <div>{props.gravity}</div>
          <div>{props.animation}</div>
        </div>
      </Dom>
    </group>
  )
}
