import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Editor } from './components/Editor'
import { Game } from './components/Game'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/" component={Game} />
        <Route exact={true} path="/editor" component={Editor} />
      </Switch>
    </Router>
  )
}

export { App }
