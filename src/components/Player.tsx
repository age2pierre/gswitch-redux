import React, { FunctionComponent } from 'react'
import { useAgentHitbox } from '../services/collisions'

const Player: FunctionComponent<{
  id: number
  xInit: number
  yInit: number
}> = ({ xInit, yInit }) => {
  const { pos, isTouching } = useAgentHitbox({
    directionInit: -Math.PI / 4,
    speedInit: 0,
    xInit,
    yInit,
  })
  const [x, y] = pos
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0.5, 1, 0]}>
        <sphereBufferGeometry attach="geometry" args={[0.5, 16, 10]} />
        <meshStandardMaterial
          attach="material"
          color={isTouching ? 'lime' : 'cyan'}
        />
      </mesh>
      <mesh position={[0.5, 0.5, 0]}>
        <cylinderGeometry attach="geometry" args={[0.35, 0.5, 1, 16]} />
        <meshStandardMaterial attach="material" color={'cyan'} opacity={0.3} />
      </mesh>
    </group>
  )
}

export default Player
