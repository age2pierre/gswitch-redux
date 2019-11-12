import {
  AppBar,
  CssBaseline,
  MuiThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import React from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import Block from './components/Block'
import PlaneEditor from './components/PlaneEditor'
import Player from './components/Player'
import useBlocksStore from './services/blocks'
import { CollisionsProvider } from './services/collisions'
import theme from './services/theme'

export default function App() {
  const items = useBlocksStore((state) => state.items)
  const addBlock = useBlocksStore((state) => state.addBlock)
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6">GSwitch-like</Typography>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        onCreated={({ gl }) => {
          gl.gammaInput = true
          gl.gammaOutput = true
          gl.toneMapping = THREE.Uncharted2ToneMapping
        }}
      >
        <CollisionsProvider>
          <pointLight />
          <ambientLight />>
          <Player
            xInit={0}
            yInit={0}
            speedInit={0}
            directionInit={-Math.PI / 4}
          />
          <PlaneEditor onClick={({ point: { x, y } }) => addBlock({ x, y })} />
          {items.map(({ x, y }) => (
            <Block
              key={`${x}${y}`}
              x={Math.round(x - 0.5)}
              y={Math.round(y - 0.5)}
            />
          ))}
        </CollisionsProvider>
      </Canvas>
    </>
  )
}
