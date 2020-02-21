import React from 'react'
import { MeshStandardMaterial } from 'three'
import { useStaticHitbox } from '../services/collisions'
import { useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const CrateAsset = () => {
  const gltf = useLoader(GLTFLoader, '/static/crate.glb')
  return (
    <mesh
      castShadow={true}
      receiveShadow={true}
      name="crate_mesh"
      scale={[0.02, 0.02, 0.02]}
    >
      <bufferGeometry attach="geometry" {...gltf?.__$[1].geometry} />
      <meshStandardMaterial
        attach="material"
        {...(gltf?.__$[1].material as MeshStandardMaterial)}
      />
    </mesh>
  )
}

export const Cube = () => {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={'orangered'} />
    </mesh>
  )
}

export const Block = (props: { x: number; y: number }) => {
  useStaticHitbox({ x: props.x, y: props.y })
  return (
    <group position={[props.x + 0.5, props.y, 0]}>
      <React.Suspense fallback={<Cube />}>
        <CrateAsset />
      </React.Suspense>
    </group>
  )
}
