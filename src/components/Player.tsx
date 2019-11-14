import React, { FunctionComponent, useState } from 'react'
import { Key } from 'ts-keycode-enum'
import { useAgentHitbox } from '../services/collisions'
import {
  ANIM_TO_COLORS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../services/constants'
import useKeyboard from '../services/keyboard'

const Player: FunctionComponent<{
  id: number
  xInit: number
  yInit: number
}> = ({ xInit, yInit }) => {
  // local state storing gravity direction
  const [gravity, setGravity] = useState<'up' | 'down'>('down')
  // local state storing character animation
  const [animation, setAnim] = useState<
    'idle' | 'running' | 'falling' | 'spinning'
  >('idle')
  // get hooked on collision engine
  const {
    pos: [x, y],
    isTouching,
    isTouchingBot,
    isTouchingTop,
    setSpeedDirection,
    speed,
    direction,
  } = useAgentHitbox({
    directionInit: -Math.PI / 4,
    speedInit: 1,
    xInit,
    yInit,
    onEndTouch: () => {
      if (animation !== 'spinning') {
        setAnim('falling')
      }
    },
    onStartTouch: () => {
      setAnim('running')
    },
  })
  // on key pressed switch gravity direction only if feet are touching
  useKeyboard(Key.M, 'keydown', () => {
    if (
      (gravity === 'down' && isTouchingBot) ||
      (gravity === 'up' && isTouchingTop)
    ) {
      setSpeedDirection([speed, -direction])
      setAnim('spinning')
      setGravity(gravity === 'up' ? 'down' : 'up')
    }
  })
  return (
    <group
      position={[x, y, 0]}
      rotation={[0, 0, gravity === 'up' ? Math.PI : 0]}
    >
      <mesh position={[0, PLAYER_HEIGHT / 2 - PLAYER_WIDTH / 2, 0]}>
        <sphereBufferGeometry
          attach="geometry"
          args={[PLAYER_WIDTH / 2, 16, 10]}
        />
        <meshStandardMaterial
          attach="material"
          color={ANIM_TO_COLORS[animation]}
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
        <meshStandardMaterial
          attach="material"
          color={isTouching ? 'lime' : 'cyan'}
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export default Player
