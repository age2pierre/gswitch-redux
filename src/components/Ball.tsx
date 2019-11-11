import React, { FunctionComponent } from 'react'
import { useDynamic } from '../services/collisions'

const Ball: FunctionComponent<{
  xInit: number
  yInit: number
  speedUnitPerSec?: number
  directionRadian?: number
}> = ({ xInit, yInit, directionRadian = 0, speedUnitPerSec = 1 }) => {
  const { pos, isTouching } = useDynamic({
    directionInit: directionRadian,
    speedInit: speedUnitPerSec,
    xInit,
    yInit,
  })
  const [x, y] = pos
  return (
    <mesh position={[x + 0.5, y + 0.5, 0]}>
      <sphereBufferGeometry attach="geometry" args={[0.5, 16, 10]} />
      <meshStandardMaterial
        attach="material"
        color={isTouching ? 'lime' : 'cyan'}
      />
    </mesh>
  )
}

export default Ball
