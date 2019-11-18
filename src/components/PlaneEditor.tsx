import React, { FunctionComponent, useRef } from 'react'
import { PointerEvent } from 'react-three-fiber'

const PlaneEditor: FunctionComponent<{
  onClick: (e: PointerEvent) => void
  gridSize?: number
}> = ({ onClick, gridSize = 200 }) => {
  const ref = useRef()

  return (
    <group>
      <mesh ref={ref} onClick={onClick}>
        <planeGeometry attach="geometry" args={[gridSize, gridSize]} />
        <meshStandardMaterial attach="material" opacity={0} />
      </mesh>
      <gridHelper
        args={[gridSize, gridSize, 0x880000]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

export default PlaneEditor
