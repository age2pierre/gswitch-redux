import React, { useRef } from 'react'
import { PointerEvent } from 'react-three-fiber'

export const PlaneEditor = (props: {
  onClick: (e: PointerEvent) => void
  gridSize?: number
}) => {
  const gridSize = props.gridSize ?? 200
  const ref = useRef()

  return (
    <group>
      <mesh ref={ref} onClick={props.onClick}>
        <planeGeometry attach="geometry" args={[gridSize, gridSize]} />
        <meshStandardMaterial attach="material" opacity={0.1} alphaTest={0.5} />
      </mesh>
      <gridHelper
        args={[gridSize, gridSize, 0x880000]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}
