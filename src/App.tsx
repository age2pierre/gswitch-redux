import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import React, { useReducer } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import Ball from './components/Ball'
import Block from './components/Block'
import PlaneEditor from './components/PlaneEditor'
import blockReducer from './services/blocks'
import theme from './services/theme'

export default function App() {
  const [blocks, dispatchBlockStore] = useReducer(blockReducer, {
    items: [],
  })

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        onCreated={({ gl }) => {
          gl.gammaInput = true
          gl.gammaOutput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
        }}
      >
        <pointLight />
        <ambientLight />>
        <Ball xInit={0} yInit={0} directionRadian={Math.PI / 4} />
        <PlaneEditor
          onClick={({ point: { x, y } }) =>
            dispatchBlockStore({ type: 'add_block', x, y })
          }
        />
        {blocks.items.map(({ x, y }) => (
          <Block
            key={`${x}${y}`}
            x={Math.round(x - 0.5)}
            y={Math.round(y - 0.5)}
          />
        ))}
      </Canvas>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
      </MuiThemeProvider>
    </>
  )
}
