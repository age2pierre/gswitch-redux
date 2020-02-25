import React, { useRef } from 'react'
import { ReactThreeFiber, useLoader } from 'react-three-fiber'
import { Group, Material, Mesh } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useStaticHitbox } from '../services/collisions'

export function CrateAsset(
  props: Partial<ReactThreeFiber.Object3DNode<Group, typeof Group>>,
) {
  const group = useRef()
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/static/crate.glb',
  ) as GLTF & {
    nodes: Record<string, Mesh>
    materials: Record<string, Material>
  }
  return (
    <group ref={group} {...props}>
      <scene name="Scene">
        <mesh
          castShadow={true}
          receiveShadow={true}
          material={materials.crate3}
          geometry={nodes.crate3_crate3_0.geometry}
          name="crate3_crate3_0"
          position={[0, 0, 0]}
          scale={[0.02, 0.02, 0.02]}
        />
      </scene>
    </group>
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
