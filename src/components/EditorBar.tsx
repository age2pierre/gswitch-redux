// import {
//   AppBar,
//   Button,
//   ButtonGroup,
//   CssBaseline,
//   makeStyles,
//   MuiThemeProvider,
//   Toolbar,
//   Typography,
// } from '@material-ui/core'
import {
  Button,
  ButtonGroup,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import useEditorStore from '../services/editor'
import pickFunc from '../services/pickFunc'

export const EditorBar: FunctionComponent<{
  onClear: () => void
}> = props => {
  const tool = useEditorStore(state => state.tool)
  const editorEnabled = useEditorStore(state => state.enabled)
  const { setTool, switchMode } = useEditorStore(pickFunc)
  return (
    <Navbar fixedToTop={true} className={Classes.DARK}>
      <NavbarGroup>
        <NavbarHeading>GSwitcher</NavbarHeading>
        <NavbarDivider />
        <Button
          icon={editorEnabled ? 'play' : 'wrench'}
          intent={editorEnabled ? 'success' : 'primary'}
          onClick={switchMode}
        />
        <Button
          className="m-l-md"
          onClick={props.onClear}
          icon="clean"
          text="Clean level"
        />
        <ButtonGroup className="m-l-md">
          <Button
            icon="eraser"
            onClick={() => setTool('eraser')}
            active={tool === 'eraser'}
          />
          <Button
            icon="edit"
            onClick={() => setTool('pencil')}
            active={tool === 'pencil'}
          />
        </ButtonGroup>
      </NavbarGroup>
    </Navbar>
  )
}

export default EditorBar
