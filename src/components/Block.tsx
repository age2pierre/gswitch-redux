import React, { FunctionComponent } from 'react'

const Block: FunctionComponent<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <mesh position={[x + 0.5, y + 0.5, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={'orangered'} />
    </mesh>
  )
}

export default Block
