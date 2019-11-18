declare module 'react-spring/three' {
  import {
    animated as animatedWeb,
    config as configWeb,
    interpolate as interpolateWeb,
    useChain as useChainWeb,
    useSpring as useSpringWeb,
    useSprings as useSpringsWeb,
    useTrail as useTrailWeb,
    useTransition as useTransitionWeb,
  } from 'react-spring'

  export const config: typeof configWeb
  export const animated: typeof animatedWeb
  export const interpolate: typeof interpolateWeb
  export const useSpring: typeof useSpringWeb
  export const useTrail: typeof useTrailWeb
  export const useTransition: typeof useTransitionWeb
  export const useChain: typeof useChainWeb
  export const useSprings: typeof useSpringsWeb
  export const a: any
}
