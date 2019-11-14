import { Collisions, Polygon } from 'detect-collisions'
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
  const [{ hitbox, topSensor, bottomSensor }, setBodies] = useState<{
    hitbox?: Polygon
    topSensor?: Polygon
    bottomSensor?: Polygon
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
    const sensorOffset = 0.1
    const [topRightVertex, botRightVertex, botLeftVertice, topLeftVertice] = [
      [PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
      [PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
      [-PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
      [-PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
    ]
    setBodies({
      hitbox: system.createPolygon(xInit, yInit, [
        topRightVertex,
        botRightVertex,
        botLeftVertice,
        topLeftVertice,
      ]),
      bottomSensor: system.createPolygon(xInit, yInit, [
        [botRightVertex[0] - sensorOffset, botRightVertex[1] + sensorOffset],
        [botRightVertex[0] - sensorOffset, botRightVertex[1] - sensorOffset],
        [botLeftVertice[0] + sensorOffset, botLeftVertice[1] + sensorOffset],
        [botLeftVertice[0] + sensorOffset, botLeftVertice[1] - sensorOffset],
      ]),
      topSensor: system.createPolygon(xInit, yInit, [
        [topRightVertex[0] - sensorOffset, topRightVertex[1] + sensorOffset],
        [topRightVertex[0] - sensorOffset, topRightVertex[1] - sensorOffset],
        [topLeftVertice[0] + sensorOffset, topLeftVertice[1] + sensorOffset],
        [topLeftVertice[0] + sensorOffset, topLeftVertice[1] - sensorOffset],
      ]),
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
    if (!hitbox || !bottomSensor || !topSensor) {
      return
    }
    hitbox.x = x + deltaX
    hitbox.y = y + deltaY
    topSensor.x = x + deltaX
    topSensor.y = y + deltaY
    bottomSensor.x = x + deltaX
    bottomSensor.y = y + deltaY
    // system update
    system.update()
    // handle collisions
    const resultHitbox = system.createResult()
    const overlaps = hitbox
      .potentials()
      .filter(b => b !== bottomSensor && b !== topSensor)
      .map(potential => {
        if (hitbox.collides(potential, resultHitbox)) {
          return {
            xIsPos: resultHitbox.overlap_x > 0,
            yIsPos: resultHitbox.overlap_y > 0,
            x: Math.abs(resultHitbox.overlap * resultHitbox.overlap_x),
            y: Math.abs(resultHitbox.overlap * resultHitbox.overlap_y),
          }
        }
        return null
      })
      .filter(notEmpty)
    const maxOverlapX = maxBy(overlaps, 'x')
    const maxOverlapY = maxBy(overlaps, 'y')
    const isTouchingTop = topSensor
      .potentials()
      .filter(b => b !== hitbox && b !== bottomSensor)
      .map(potential => topSensor.collides(potential))
      .includes(true)
    const isTouchingBot = bottomSensor
      .potentials()
      .filter(b => b !== hitbox && b !== topSensor)
      .map(potential => bottomSensor.collides(potential))
      .includes(true)
    if (maxOverlapX) {
      const dX = maxOverlapX.xIsPos ? maxOverlapX.x : -maxOverlapX.x
      hitbox.x -= dX
      bottomSensor.x -= dX
      topSensor.x -= dX
    }
    if (maxOverlapY) {
      const dY = maxOverlapY.yIsPos ? maxOverlapY.y : -maxOverlapY.y
      hitbox.y -= dY
      bottomSensor.y -= dY
      topSensor.y -= dY
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
