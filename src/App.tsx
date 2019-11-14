import {
  AppBar,
  Button,
  ButtonGroup,
  CssBaseline,
  makeStyles,
  MuiThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { AddBox, Delete } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import Block from './components/Block'
import PlaneEditor from './components/PlaneEditor'
import Player from './components/Player'
import { CollisionsProvider } from './services/collisions'
import useLevelStore from './services/level'
import pickFunc from './services/pickFunc'
import theme from './services/theme'

const useStyle = makeStyles(() => ({
  appBarItem: {
    marginRight: theme.spacing(2),
  },
}))

export default function App() {
  const classes = useStyle()
  const items = useLevelStore(state => state.items)
  const { addBlock, clear, loadFromStorage, saveToStorage } = useLevelStore(
    pickFunc,
  )
  useEffect(() => {
    loadFromStorage()
    window.addEventListener('unload', () => saveToStorage())
  }, [])
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" className={classes.appBarItem}>
              GSwitch-like
            </Typography>
            <Button
              variant="outlined"
              onClick={clear}
              className={classes.appBarItem}
            >
              Clear level
            </Button>
            <ButtonGroup>
              <Button>
                <AddBox color="secondary" />
              </Button>
              <Button>
                <Delete />
              </Button>
            </ButtonGroup>
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
          <Player id={0} xInit={0} yInit={0} />
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
