import {
  Button,
  ButtonGroup,
  Classes,
  Icon,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Slider,
} from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import useEditorStore from '../services/editor'
import pickFunc from '../services/pickFunc'

export const EditorBar: FunctionComponent<{
  onCleanLevel: () => void
}> = props => {
  const tool = useEditorStore(state => state.tool)
  const cameraScroll = useEditorStore(state => state.cameraScroll)
  const editorEnabled = useEditorStore(state => state.enabled)
  const { setTool, switchMode, slideCamera } = useEditorStore(pickFunc)
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
          onClick={props.onCleanLevel}
          icon="clean"
          text="Clean level"
          disabled={!editorEnabled}
        />
        <ButtonGroup className="m-l-md">
          <Button
            icon="eraser"
            onClick={() => setTool('eraser')}
            active={tool === 'eraser'}
            disabled={!editorEnabled}
          />
          <Button
            icon="edit"
            onClick={() => setTool('pencil')}
            active={tool === 'pencil'}
            disabled={!editorEnabled}
          />
        </ButtonGroup>
      </NavbarGroup>
      <NavbarGroup align="right">
        <Icon icon="camera" />
        <Slider
          disabled={!editorEnabled}
          className="m-l-lg"
          min={0}
          max={1}
          stepSize={0.0001}
          onChange={slideCamera}
          labelRenderer={false}
          value={cameraScroll}
        />
      </NavbarGroup>
    </Navbar>
  )
}

export default EditorBar
