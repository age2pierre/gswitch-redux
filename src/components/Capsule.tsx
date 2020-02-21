import React, { useMemo } from 'react'
import { Color, Face3, Geometry, Vector3, Vector4 } from 'three'

/*
  Implemented from a technique described here:
  http://paulbourke.net/geometry/capsule/

  PID2 taken from Paul Bourke's paulslib.h
  PID2 = 1.570796326794896619231322;

  ISSUES:

    add ability to add loops in middle segment

  COOL THINGS:

    using a positive PID2 will invert the caps
*/

function createCapsuleGeometry(radius = 1, height = 2, N = 32) {
  const geometry = new Geometry()
  const TWOPI = Math.PI * 2

  const PID2 = 1.570796326794896619231322

  const normals = []

  // top cap
  for (let i = 0; i <= N / 4; i++) {
    for (let j = 0; j <= N; j++) {
      const theta = (j * TWOPI) / N
      const phi = -PID2 + (Math.PI * i) / (N / 2)
      const vertex = new Vector3()
      const normal = new Vector3()
      vertex.x = radius * Math.cos(phi) * Math.cos(theta)
      vertex.y = radius * Math.cos(phi) * Math.sin(theta)
      vertex.z = radius * Math.sin(phi)
      vertex.z -= height / 2
      normal.x = vertex.x
      normal.y = vertex.y
      normal.z = vertex.z
      geometry.vertices.push(vertex)
      normals.push(normal)
    }
  }

  // bottom cap
  for (let i = N / 4; i <= N / 2; i++) {
    for (let j = 0; j <= N; j++) {
      const theta = (j * TWOPI) / N
      const phi = -PID2 + (Math.PI * i) / (N / 2)
      const vertex = new Vector3()
      const normal = new Vector3()
      vertex.x = radius * Math.cos(phi) * Math.cos(theta)
      vertex.y = radius * Math.cos(phi) * Math.sin(theta)
      vertex.z = radius * Math.sin(phi)
      vertex.z += height / 2
      normal.x = vertex.x
      normal.y = vertex.y
      normal.z = vertex.z
      geometry.vertices.push(vertex)
      normals.push(normal)
    }
  }

  for (let i = 0; i <= N / 2; i++) {
    for (let j = 0; j < N; j++) {
      const vec = new Vector4(
        i * (N + 1) + j,
        i * (N + 1) + (j + 1),
        (i + 1) * (N + 1) + (j + 1),
        (i + 1) * (N + 1) + j,
      )

      if (i === N / 4) {
        geometry.faces.push(
          new Face3(vec.x, vec.z, vec.w, [
            normals[vec.x],
            normals[vec.z],
            normals[vec.w],
          ]),
        )
        geometry.faces.push(
          new Face3(vec.x, vec.y, vec.z, [
            // ok
            normals[vec.x],
            normals[vec.y],
            normals[vec.z],
          ]),
        )
      } else {
        geometry.faces.push(
          new Face3(vec.x, vec.y, vec.z, [
            normals[vec.x],
            normals[vec.y],
            normals[vec.z],
          ]),
        )
        geometry.faces.push(
          new Face3(vec.x, vec.z, vec.w, [
            normals[vec.x],
            normals[vec.z],
            normals[vec.w],
          ]),
        )
      }
    }
    // if(i==(N/4)) break; // N/4 is when the center segments are solved
  }

  geometry.computeFaceNormals()
  // geometry.computeVertexNormals();
  return geometry
}

export const Capsule = (props: {
  x: number
  y: number
  color?: Color | string | number
}) => {
  const geometry = useMemo(() => createCapsuleGeometry(0.5, 0.5), [])
  return (
    <mesh
      position={[props.x + 0.5, props.y + 0.5, 0]}
      geometry={geometry}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow={true}
      receiveShadow={true}
    >
      <meshStandardMaterial
        attach="material"
        color={props.color ?? 'orange'}
        roughness={1}
      />
    </mesh>
  )
}
