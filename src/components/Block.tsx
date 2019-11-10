import React, { FunctionComponent } from 'react'
import { useStatic } from '../services/collisions'

const Block: FunctionComponent<{ x: number; y: number }> = ({ x, y }) => {
  useStatic({ x, y })
  return (
    <mesh position={[x + 0.5, y + 0.5, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={'orangered'} />
    </mesh>
  )
}

export default Block
