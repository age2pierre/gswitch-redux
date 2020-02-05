import React, { FunctionComponent, Suspense } from 'react'
import { MeshStandardMaterial } from 'three'
import { resource } from '../services/cachedRessource'
import { useStaticHitbox } from '../services/collisions'

export const Asset: FunctionComponent<{
  url: string
  x: number
  y: number
}> = ({ url, x, y }) => {
  const gltf = resource.read(url)
  return (
    <mesh
      castShadow={false}
      receiveShadow={false}
      name="crate_mesh"
      scale={[0.02, 0.02, 0.02]}
      position={[x + 0.5, y, 0]}
    >
      <bufferGeometry attach="geometry" {...gltf?.__$[1].geometry} />
      <meshStandardMaterial
        attach="material"
        {...(gltf?.__$[1].material as MeshStandardMaterial)}
      />
    </mesh>
  )
}

export const Cube: FunctionComponent<{
  x: number
  y: number
}> = ({ x, y }) => (
  <mesh position={[x + 0.5, y + 0.5, 0]}>
    <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
    <meshStandardMaterial attach="material" color={'orangered'} />
  </mesh>
)

export const Block: FunctionComponent<{ x: number; y: number }> = ({
  x,
  y,
}) => {
  useStaticHitbox({ x, y })
  return (
    <Suspense fallback={<Cube x={x} y={y} />}>
      <Asset url="/static/crate.glb" x={x} y={y} />
    </Suspense>
  )
}
