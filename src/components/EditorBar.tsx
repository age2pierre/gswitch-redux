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
import React, { FunctionComponent } from 'react'
import theme from '../services/theme'

const useStyle = makeStyles(() => ({
  appBarItem: {
    marginRight: theme.spacing(2),
  },
}))

const EditorBar: FunctionComponent<{
  onClear: () => void
}> = props => {
  const classes = useStyle()
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.appBarItem}>
            GSwitch-like
          </Typography>
          <Button
            variant="outlined"
            onClick={props.onClear}
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
  )
}

export default EditorBar
