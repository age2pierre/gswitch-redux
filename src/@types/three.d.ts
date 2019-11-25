import { Mesh } from 'three'
import 'three/examples/jsm/loaders/GLTFLoader'
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  interface GLTF {
    __$: Mesh[]
  }
}
