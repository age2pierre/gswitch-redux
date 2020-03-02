import React, { useEffect, useRef, useState, useMemo } from 'react'
import { config } from 'react-spring'
import { Spring } from 'react-spring/renderprops'
import { useFrame, useLoader } from 'react-three-fiber'
import {
  AnimationAction,
  AnimationMixer,
  Color,
  ColorLike,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
  Scene,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'

interface RobotAnimationsActions {
  // Robot_Dance: AnimationAction
  Robot_Idle: AnimationAction
  // Robot_Jump: AnimationAction
  // Robot_No: AnimationAction
  // Robot_Punch: AnimationAction
  Robot_Running: AnimationAction
  // Robot_Sitting: AnimationAction
  // Robot_ThumbsUp: AnimationAction
  // Robot_WalkJump: AnimationAction
}

type RobotAnimationsWeights = {
  [P in keyof RobotAnimationsActions]: number
}

function isAnyMesh(obj: any): obj is Mesh | SkinnedMesh {
  return obj.type === 'Mesh' || obj.type === 'SkinnedMesh'
}

function isMeshStandardMaterial(obj: any): obj is MeshStandardMaterial {
  return obj.type === 'MeshStandardMaterial'
}

interface RobotProps {
  mainColor: ColorLike
  animationWeights: RobotAnimationsWeights
}

function AnimableRobot(props: RobotProps) {
  const { mainColor, animationWeights } = props

  const group = useRef<Group>()
  const gltf = useLoader(GLTFLoader, '/static/robot.glb')
  const scene = useMemo(() => {
    const _scene = SkeletonUtils.clone(gltf.scene) as Scene
    const mapNameToColor = {
      Grey: new Color(0.43, 0.43, 0.43),
      Main: new Color(mainColor),
      Black: new Color(0.06, 0.06, 0.06),
    } as const
    _scene.traverse(childNode => {
      if (isAnyMesh(childNode)) {
        childNode.castShadow = true
        childNode.receiveShadow = true
        if (isMeshStandardMaterial(childNode.material)) {
          childNode.material = childNode.material.clone()
          ;(childNode.material as MeshStandardMaterial).color =
            mapNameToColor[
              childNode.material.name as keyof typeof mapNameToColor
            ]
        }
      }
    })
    return _scene
  }, [mainColor, gltf])

  const actions = useRef<RobotAnimationsActions>()
  const [mixer] = useState(
    () => new AnimationMixer((group.current as unknown) as Object3D),
  )
  useFrame((_, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      // Robot_Dance: mixer.clipAction(gltf.animations[0], group.current),
      Robot_Idle: mixer.clipAction(gltf.animations[1], group.current),
      // Robot_Jump: mixer.clipAction(gltf.animations[2], group.current),
      // Robot_No: mixer.clipAction(gltf.animations[3], group.current),
      // Robot_Punch: mixer.clipAction(gltf.animations[4], group.current),
      Robot_Running: mixer.clipAction(gltf.animations[5], group.current),
      // Robot_Sitting: mixer.clipAction(gltf.animations[6], group.current),
      // Robot_ThumbsUp: mixer.clipAction(gltf.animations[7], group.current),
      // Robot_WalkJump: mixer.clipAction(gltf.animations[8], group.current),
    }
    Object.values(actions.current).forEach((action: AnimationAction) => {
      action.enabled = true
      action.setEffectiveTimeScale(1)
      action.setEffectiveWeight(0)
      action.play()
    })
    return () => gltf.animations.forEach(clip => mixer.uncacheClip(clip))
  }, [])

  useEffect(() => {
    Object.keys(animationWeights).forEach(k => {
      ;(actions.current ?? {})[
        k as keyof RobotAnimationsWeights
      ]?.setEffectiveWeight(animationWeights[k as keyof RobotAnimationsWeights])
    })
  }, [animationWeights])

  return (
    <group
      name="Robot"
      ref={group}
      rotation={[0, Math.PI / 2, 0]}
      scale={[0.35, 0.35, 0.35]}
    >
      <primitive object={scene} dispose={null} />
    </group>
  )
}

export const Robot = (
  props: Omit<RobotProps, 'animationWeights'> & {
    targetAnimation: keyof RobotAnimationsActions
  },
) => {
  return (
    <Spring
      to={{
        Robot_Idle: props.targetAnimation === 'Robot_Idle' ? 1 : 0,
        Robot_Running: props.targetAnimation === 'Robot_Running' ? 1 : 0,
      }}
      config={config.slow}
    >
      {weights => (
        <AnimableRobot animationWeights={weights} mainColor={props.mainColor} />
      )}
    </Spring>
  )
}
