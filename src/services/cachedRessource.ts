import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { unstable_createResource as createResource } from './react-cache'

const blackList = [
  'id',
  'uuid',
  'type',
  'children',
  'parent',
  'matrix',
  'matrixWorld',
  'matrixWorldNeedsUpdate',
  'modelViewMatrix',
  'normalMatrix',
]

function prune(props: any) {
  const reducedProps = { ...props }
  // Remove black listed props
  blackList.forEach(name => delete reducedProps[name])
  // Remove functions
  Object.keys(reducedProps).forEach(
    name =>
      typeof reducedProps[name] === 'function' && delete reducedProps[name],
  )
  // Prune materials and geometries
  if (reducedProps.material) {
    reducedProps.material = prune(reducedProps.material)
  }
  if (reducedProps.geometry) {
    reducedProps.geometry = prune(reducedProps.geometry)
  }
  // Return cleansed object
  return reducedProps
}

export const resource = createResource<string, string, GLTF>(
  file =>
    new Promise(res =>
      new GLTFLoader().load(file, (data: any) => {
        const objects: any[] = []
        if (data.scene) {
          data.scene.traverse((props: any) => objects.push(prune(props)))
        }
        data.__$ = objects
        res(data)
      }),
    ),
)
