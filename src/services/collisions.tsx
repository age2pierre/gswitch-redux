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
  const [body, setBody] = useState<Polygon>()
  const [[speed, direction], setSpeedDirection] = useState([
    speedInit,
    directionInit,
  ])
  const [[x, y, touching, prevTouching], setState] = useState([
    xInit,
    yInit,
    false,
    false,
  ])
  useEffect(() => {
    const xOffset = -PLAYER_WIDTH / 2
    const yOffset = -PLAYER_HEIGHT / 3
    setBody(
      system.createPolygon(xInit, yInit, [
        [PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
        [PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
        [-PLAYER_WIDTH / 2 + xOffset, -PLAYER_HEIGHT / 2 + yOffset],
        [-PLAYER_WIDTH / 2 + xOffset, PLAYER_HEIGHT / 2 + yOffset],
      ]),
    )
    return () => {
      if (body) {
        body.remove()
      }
    }
  }, [])
  useFrame((_, deltaSecond) => {
    // game logic
    const distance = deltaSecond * speed
    const deltaX = Math.cos(direction) * distance
    const deltaY = Math.sin(direction) * distance
    if (!body) {
      return
    }
    body.x = x + deltaX
    body.y = y + deltaY
    // system update
    system.update()
    // handle collisions
    const potentials = body.potentials()
    const result = system.createResult()
    const overlaps = potentials
      .map(potential => {
        if (body.collides(potential, result)) {
          return {
            xIsPos: result.overlap_x > 0,
            yIsPos: result.overlap_y > 0,
            x: Math.abs(result.overlap * result.overlap_x),
            y: Math.abs(result.overlap * result.overlap_y),
          }
        }
        return null
      })
      .filter(notEmpty)
    const maxOverlapX = maxBy(overlaps, 'x')
    const maxOverlapY = maxBy(overlaps, 'y')
    if (maxOverlapX) {
      body.x -= maxOverlapX.xIsPos ? maxOverlapX.x : -maxOverlapX.x
    }
    if (maxOverlapY) {
      body.y -= maxOverlapY.yIsPos ? maxOverlapY.y : -maxOverlapY.y
    }
    setState([body.x, body.y, overlaps.length ? true : false, touching])
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
    pos: [x, y],
    speed,
    direction,
    setSpeedDirection,
  }
}
