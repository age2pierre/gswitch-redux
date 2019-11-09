import { ReactThreeFiber } from 'react-three-fiber'
import { Fog } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fog: ReactThreeFiber.Node<Fog, typeof Fog>
    }
  }
}
