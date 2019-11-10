import { Collisions, Polygon } from 'detect-collisions'
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useFrame } from 'react-three-fiber'

const SCALE_FACTOR = 10
const context = createContext<Collisions>(new Collisions())

export const CollisionsProvider: FunctionComponent<{}> = ({ children }) => {
  const [system] = useState<Collisions>(() => new Collisions())
  // useFrame(() => system.update())
  return <context.Provider value={system} children={children} />
}

export const useStatic = ({ x, y }: { x: number; y: number }) => {
  const system = useContext(context)
  const [body, set] = useState<Polygon>()
  useEffect(() => {
    set(
      system.createPolygon(x * SCALE_FACTOR, y * SCALE_FACTOR, [
        [0.5 * SCALE_FACTOR, 0.5 * SCALE_FACTOR],
        [0.5 * SCALE_FACTOR, -0.5 * SCALE_FACTOR],
        [-0.5 * SCALE_FACTOR, -0.5 * SCALE_FACTOR],
        [-0.5 * SCALE_FACTOR, 0.5 * SCALE_FACTOR],
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

export const useDynamic = ({
  xInit,
  yInit,
  speedInit,
  directionInit,
}: {
  xInit: number
  yInit: number
  speedInit: number
  directionInit: number
}) => {
  const system = useContext(context)
  const [body] = useState<Polygon>(
    system.createPolygon(xInit * SCALE_FACTOR, yInit * SCALE_FACTOR, [
      [0.5 * SCALE_FACTOR, 0.5 * SCALE_FACTOR],
      [0.5 * SCALE_FACTOR, -0.5 * SCALE_FACTOR],
      [-0.5 * SCALE_FACTOR, -0.5 * SCALE_FACTOR],
      [-0.5 * SCALE_FACTOR, 0.5 * SCALE_FACTOR],
    ]),
  )
  const [[speed, direction], setSpeedDirection] = useState([
    speedInit,
    directionInit,
  ])
  const [[x, y], setPos] = useState([xInit, yInit])
  const [isTouching, setTouching] = useState(false)
  useEffect(() => {
    return () => {
      if (body) {
        body.remove()
      }
    }
  }, [])
  useFrame((_, deltaSecond) => {
    // game logic
    const distance = deltaSecond * speed * SCALE_FACTOR
    const deltaX = Math.cos(direction) * distance
    const deltaY = Math.sin(direction) * distance
    body.x = x * SCALE_FACTOR + deltaX
    body.y = y * SCALE_FACTOR + deltaY
    // system update
    system.update()
    // handle collisions
    const potentials = body.potentials()
    const result = system.createResult()
    const [xUpdated, yUpdated, touchingUpdated] = potentials.reduce(
      ([curX, curY, touching], pot) => {
        if (body.collides(pot, result)) {
          return [
            curX - result.overlap * result.overlap_x,
            curY - result.overlap * result.overlap_y,
            true,
          ]
        }
        return [curX, curY, touching]
      },
      [x * SCALE_FACTOR + deltaX, y * SCALE_FACTOR + deltaY, false],
    )
    body.x = xUpdated
    body.y = yUpdated
    setPos([xUpdated / SCALE_FACTOR, yUpdated / SCALE_FACTOR])
    setTouching(touchingUpdated)
  })

  return {
    isTouching,
    pos: [x, y],
    setSpeedDirection,
  }
}
