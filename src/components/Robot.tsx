import React, { useEffect, useRef, useState } from 'react'
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
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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

  useEffect(() => {
    const mapNameToColor = {
      Grey: new Color(0.43, 0.43, 0.43),
      Main: new Color(mainColor),
      Black: new Color(0.06, 0.06, 0.06),
    } as const
    Object.values(gltf.nodes).forEach(node => {
      node.traverse(childNode => {
        if (
          isAnyMesh(childNode) &&
          isMeshStandardMaterial(childNode.material)
        ) {
          childNode.material.color =
            mapNameToColor[
              childNode.material.name as keyof typeof mapNameToColor
            ]
        }
      })
    })
  }, [gltf, mainColor])

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
    actions.current?.Robot_Idle.setEffectiveWeight(animationWeights.Robot_Idle)
    actions.current?.Robot_Running.setEffectiveWeight(
      animationWeights.Robot_Running,
    )
  }, [animationWeights])

  return (
    <group
      name="Robot"
      ref={group}
      rotation={[0, Math.PI / 2, 0]}
      scale={[0.35, 0.35, 0.35]}
    >
      <primitive object={gltf.nodes.Bone} />
      <primitive object={gltf.nodes.HandL} />
      <primitive object={gltf.nodes.HandR} />
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
