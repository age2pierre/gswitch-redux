import React, { FunctionComponent, useState } from 'react'
import { useAgentHitbox } from '../services/collisions'
import {
  PLAYER_ANGLE,
  PLAYER_KEYMAP,
  PLAYER_SPEED,
  PLAYER_STARTING_POINTS,
} from '../services/constants'
import useKeyboard from '../services/keyboard'
import Dummy from './Dummy'

const Player: FunctionComponent<{
  id: number
}> = ({ id }) => {
  // local state storing gravity direction
  const [gravity, setGravity] = useState<'up' | 'down'>('down')
  // local state storing character animation
  const [animation, setAnim] = useState<
    'idle' | 'running' | 'falling' | 'spinning'
  >('idle')
  // get hooked on collision engine
  const {
    pos: [x, y],
    isTouchingBot,
    isTouchingTop,
    setSpeedDirection,
    speed,
    direction,
  } = useAgentHitbox({
    directionInit: -PLAYER_ANGLE,
    speedInit: PLAYER_SPEED,
    xInit: PLAYER_STARTING_POINTS[id][0],
    yInit: PLAYER_STARTING_POINTS[id][1],
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
  useKeyboard(PLAYER_KEYMAP[id], 'keydown', () => {
    if (
      (gravity === 'down' && isTouchingBot) ||
      (gravity === 'up' && isTouchingTop)
    ) {
      setSpeedDirection([speed, -direction])
      setAnim('spinning')
      setGravity(gravity === 'up' ? 'down' : 'up')
    }
  })
  const props = {
    gravity,
    animation,
    x,
    y,
  } as const
  return <Dummy {...props} />
}

export default Player
