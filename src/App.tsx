import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import React, { Component } from 'react'
import Toggle from './components/Toggle'
import theme from './services/theme'

export default class App extends Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Toggle text="Click Me" />
      </MuiThemeProvider>
    )
  }
}
