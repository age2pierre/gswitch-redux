import React, { FunctionComponent } from 'react'
import {
  ANIM_TO_COLORS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../services/constants'

const Dummy: FunctionComponent<{
  x: number
  y: number
  gravity: 'up' | 'down'
  animation: 'idle' | 'running' | 'falling' | 'spinning'
}> = props => (
  <group
    position={[props.x, props.y, 0]}
    rotation={[0, 0, props.gravity === 'up' ? Math.PI : 0]}
  >
    <mesh position={[0, PLAYER_HEIGHT / 2 - PLAYER_WIDTH / 2, 0]}>
      <sphereBufferGeometry
        attach="geometry"
        args={[PLAYER_WIDTH / 2, 16, 10]}
      />
      <meshStandardMaterial
        attach="material"
        color={ANIM_TO_COLORS[props.animation]}
      />
    </mesh>
    <mesh position={[0, -PLAYER_HEIGHT / 6, 0]}>
      <cylinderGeometry
        attach="geometry"
        args={[
          0.7 * (PLAYER_WIDTH / 2),
          PLAYER_WIDTH / 2,
          (PLAYER_HEIGHT * 2) / 3,
          16,
        ]}
      />
      <meshStandardMaterial attach="material" color="cyan" opacity={0.3} />
    </mesh>
  </group>
)

export default Dummy
