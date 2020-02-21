import React, { useState } from 'react'
import { useAgentHitbox } from '../services/collisions'
import { PLAYER_ANGLE, PLAYERS, PLAYER_SPEED } from '../services/constants'
import { useKeyboard } from '../services/keyboard'
import { Dummy, DummyProps } from './Dummy'

export const Player = (props: { id: number }) => {
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
    xInit: PLAYERS[props.id].startPoint[0],
    yInit: PLAYERS[props.id].startPoint[1],
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
  useKeyboard(PLAYERS[props.id].code, 'keydown', () => {
    if (
      (gravity === 'down' && isTouchingBot) ||
      (gravity === 'up' && isTouchingTop)
    ) {
      setSpeedDirection([speed, -direction])
      setAnim('spinning')
      setGravity(gravity === 'up' ? 'down' : 'up')
    }
  })
  const assetProps: DummyProps = {
    gravity,
    animation,
    x,
    y,
    ctrlKey: PLAYERS[props.id].name,
    color: PLAYERS[props.id].color,
  } as const
  return <Dummy {...assetProps} />
}
