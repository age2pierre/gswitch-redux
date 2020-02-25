import { Mesh, Color, Material, Object3D } from 'three'
import 'three/examples/jsm/loaders/GLTFLoader'

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  interface GLTF {
    __$: Mesh[]
    nodes: Record<string, Object3D>
    materials: Record<string, Material>
  }
}

declare module 'three' {
  type ColorLike = Color | string | number
}
