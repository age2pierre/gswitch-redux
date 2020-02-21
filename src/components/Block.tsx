import React from 'react'
import { MeshStandardMaterial } from 'three'
import { resource } from '../services/cachedRessource'
import { useStaticHitbox } from '../services/collisions'

export const Asset = (props: { url: string; x: number; y: number }) => {
  const gltf = resource.read(props.url)
  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
      name="crate_mesh"
      scale={[0.02, 0.02, 0.02]}
      position={[props.x + 0.5, props.y, 0]}
    >
      <bufferGeometry attach="geometry" {...gltf?.__$[1].geometry} />
      <meshStandardMaterial
        attach="material"
        {...(gltf?.__$[1].material as MeshStandardMaterial)}
      />
    </mesh>
  )
}

export const Cube = (props: { x: number; y: number }) => {
  return (
    <mesh position={[props.x + 0.5, props.y + 0.5, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={'orangered'} />
    </mesh>
  )
}

export const Block = (props: { x: number; y: number }) => {
  useStaticHitbox({ x: props.x, y: props.y })
  return (
    <React.Suspense fallback={<Cube x={props.x} y={props.y} />}>
      <Asset url="/static/crate.glb" x={props.x} y={props.y} />
    </React.Suspense>
  )
}
