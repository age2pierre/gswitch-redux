import React, { useRef, Ref } from 'react'
import { ReactThreeFiber, useLoader } from 'react-three-fiber'
import { Group, Material, Mesh, ColorLike, Object3D } from 'three'
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

export const Cube = React.forwardRef(
  (
    props: ReactThreeFiber.Object3DNode<Mesh, typeof Mesh> & {
      width?: number
      height?: number
      color?: ColorLike
    },
    ref: Ref<Object3D | undefined>,
  ) => {
    const { width = 1, height = 1 } = props
    return (
      <mesh {...props} ref={ref}>
        <boxBufferGeometry attach="geometry" args={[width, height, 1]} />
        <meshStandardMaterial
          attach="material"
          color={props.color ?? 'orangered'}
        />
      </mesh>
    )
  },
)

export const Block = (props: { x: number; y: number }) => {
  useStaticHitbox({ x: props.x, y: props.y })
  return (
    <group position={[props.x + 0.5, props.y, 0]}>
      <React.Suspense fallback={<Cube position={[0, 0.5, 0]} />}>
        <CrateAsset />
      </React.Suspense>
    </group>
  )
}
