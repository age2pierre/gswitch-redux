import { Spinner } from '@blueprintjs/core/lib/esnext/components/spinner/spinner'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const Editor = React.lazy(() => import('./components/Editor'))
const Game = React.lazy(() => import('./components/Game'))
const Test = React.lazy(() => import('./components/Test'))

const Loading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Spinner size={100} />
    </div>
  )
}

export const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route exact={true} path="/" component={Game} />
          <Route exact={true} path="/editor" component={Editor} />
          <Route exact={true} path="/test" component={Test} />
        </Switch>
      </React.Suspense>
    </Router>
  )
}
