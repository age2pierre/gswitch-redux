import React, { FunctionComponent } from 'react'
import { useMovingAgent } from '../services/collisions'

const Player: FunctionComponent<{
  xInit: number
  yInit: number
  speedInit?: number
  directionInit?: number
}> = ({ xInit, yInit, directionInit = 0, speedInit = 1 }) => {
  const { pos, isTouching } = useMovingAgent({
    directionInit,
    speedInit,
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
        <sphereBufferGeometry attach="geometry" args={[0.5, 16, 10]} />
        <meshStandardMaterial attach="material" color={'cyan'} opacity={0.3} />
      </mesh>
    </group>
  )
}

export default Player
