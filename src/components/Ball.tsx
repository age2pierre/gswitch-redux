import React, { FunctionComponent, useState } from 'react'
import { useFrame } from 'react-three-fiber'

const Ball: FunctionComponent<{
  xInit: number
  yInit: number
  speedUnitPerSec?: number
  directionRadian?: number
}> = ({ xInit, yInit, directionRadian = 0, speedUnitPerSec = 1 }) => {
  const [[x, y], setPos] = useState([xInit, yInit])
  useFrame((_, deltaSecond) => {
    const distance = deltaSecond * speedUnitPerSec
    const deltaX = Math.cos(directionRadian) * distance
    const deltaY = Math.sin(directionRadian) * distance
    setPos([x + deltaX, y + deltaY])
  })

  return (
    <mesh position={[x + 0.5, y + 0.5, 0]}>
      <sphereBufferGeometry attach="geometry" args={[0.5, 16, 10]} />
      <meshStandardMaterial attach="material" color={'lime'} />
    </mesh>
  )
}

export default Ball
