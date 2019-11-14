import { Collisions, Polygon, Circle, Point } from 'detect-collisions'
import { maxBy } from 'lodash-es'
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useFrame } from 'react-three-fiber'
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './constants'
import { height } from '@material-ui/system'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value != null
}

const context = createContext<Collisions>(new Collisions())

export const CollisionsProvider: FunctionComponent<{}> = ({ children }) => {
  const [system] = useState<Collisions>(() => new Collisions())
  // useFrame(() => system.update())
  return <context.Provider value={system} children={children} />
}

export const useStaticHitbox = ({ x, y }: { x: number; y: number }) => {
  const system = useContext(context)
  const [body, set] = useState<Polygon>()
  useEffect(() => {
    set(
      system.createPolygon(x, y, [
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, -0.5],
        [-0.5, 0.5],
      ]),
    )
    return () => {
      if (body) {
        body.remove()
        set(undefined)
      }
    }
  }, [])
}

export const useAgentHitbox = ({
  xInit,
  yInit,
  speedInit,
  directionInit,
  onStartTouch,
  onEndTouch,
}: {
  xInit: number
  yInit: number
  speedInit: number
  directionInit: number
  onStartTouch: () => void
  onEndTouch: () => void
}) => {
  const system = useContext(context)
  const [{ hitbox, topPoint, botPoint }, setBodies] = useState<{
    hitbox?: Polygon
    topPoint?: Point
    botPoint?: Point
  }>({})
  const [[speed, direction], setSpeedDirection] = useState([
    speedInit,
    directionInit,
  ])
  const [
    [x, y, touching, prevTouching, touchingTop, touchingBot],
    setState,
  ] = useState([xInit, yInit, false, false, false, false])
  useEffect(() => {
    const xOffset = -PLAYER_WIDTH / 2
    const yOffset = -PLAYER_HEIGHT / 3
    setBodies({
      hitbox: system.createPolygon(xInit, yInit, [
        [PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
        [PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
        [-PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
        [-PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
      ]),
      botPoint: system.createPoint(
        xInit + xOffset,
        yInit - PLAYER_HEIGHT / 2 - 0.1 + yOffset,
      ),
      topPoint: system.createPoint(
        xInit + xOffset,
        yInit + PLAYER_HEIGHT / 2 + 0.1 + yOffset,
      ),
    })
    return () => {
      if (hitbox) {
        hitbox.remove()
      }
    }
  }, [])
  useFrame((_, deltaSecond) => {
    // game logic
    const distance = deltaSecond * speed
    const deltaX = Math.cos(direction) * distance
    const deltaY = Math.sin(direction) * distance
    if (!hitbox || !botPoint || !topPoint) {
      return
    }
    hitbox.x = x + deltaX
    hitbox.y = y + deltaY
    // system update
    system.update()
    // handle collisions
    const potentials = hitbox.potentials()
    const resultHitbox = system.createResult()
    const overlaps = potentials
      .filter(b => b !== botPoint && b !== topPoint)
      .map(potential => {
        if (hitbox.collides(potential, resultHitbox)) {
          return {
            xIsPos: resultHitbox.overlap_x > 0,
            yIsPos: resultHitbox.overlap_y > 0,
            x: Math.abs(resultHitbox.overlap * resultHitbox.overlap_x),
            y: Math.abs(resultHitbox.overlap * resultHitbox.overlap_y),
            touchingBot: botPoint.collides(potential),
            touchingTop: topPoint.collides(potential),
          }
        }
        return null
      })
      .filter(notEmpty)
    const maxOverlapX = maxBy(overlaps, 'x')
    const maxOverlapY = maxBy(overlaps, 'y')
    const isTouchingTop = overlaps.some(o => o.touchingTop)
    const isTouchingBot = overlaps.some(o => o.touchingBot)
    if (maxOverlapX) {
      const dX = maxOverlapX.xIsPos ? maxOverlapX.x : -maxOverlapX.x
      hitbox.x -= dX
      botPoint.x -= dX
      topPoint.x -= dX
    }
    if (maxOverlapY) {
      const dY = maxOverlapY.yIsPos ? maxOverlapY.y : -maxOverlapY.y
      hitbox.y -= dY
      botPoint.y -= dY
      topPoint.y -= dY
    }
    setState([
      hitbox.x,
      hitbox.y,
      overlaps.length ? true : false,
      touching,
      isTouchingTop,
      isTouchingBot,
    ])
  })

  useEffect(() => {
    if (touching !== prevTouching) {
      if (touching) {
        onStartTouch()
      } else {
        onEndTouch()
      }
    }
  }, [touching, prevTouching])

  return {
    isTouching: touching,
    isTouchingBot: touchingBot,
    isTouchingTop: touchingTop,
    pos: [x, y],
    speed,
    direction,
    setSpeedDirection,
  }
}
