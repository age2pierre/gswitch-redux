import React, { FunctionComponent, useState } from 'react'
import pickFunc from '~services/pickFunc'
import useRaceStore from '~services/race'
import { useAgentHitbox } from '../services/collisions'
import * as cst from '../services/constants'
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
    directionInit: -cst.PLAYER_ANGLE,
    speedInit: cst.PLAYER_SPEED,
    xInit: cst.PLAYER_STARTING_POINTS[id][0],
    yInit: cst.PLAYER_STARTING_POINTS[id][1],
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
  useKeyboard(cst.PLAYER_KEYMAP[id], 'keydown', () => {
    if (
      (gravity === 'down' && isTouchingBot) ||
      (gravity === 'up' && isTouchingTop)
    ) {
      setSpeedDirection([speed, -direction])
      setAnim('spinning')
      setGravity(gravity === 'up' ? 'down' : 'up')
    }
  })
  const { playersEndsMatch } = useRaceStore(pickFunc)
  const cameraScroll = useRaceStore(state => state.cameraScroll)
  const isRacing = useRaceStore(state => !state.players[id].finishedRace)
  if (
    isRacing &&
    (y > cst.BORDER_TOP ||
      y < cst.BORDER_DOWN ||
      x > cst.LEVEL_LENGTH ||
      x < cameraScroll - cst.BORDER_LEFT)
  ) {
    playersEndsMatch(id, x / cst.LEVEL_LENGTH)
  }

  const props = {
    gravity,
    animation,
    x,
    y,
  } as const
  return <Dummy {...props} />
}

export default Player
