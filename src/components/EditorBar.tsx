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
import { Link } from 'react-router-dom'
import { useEditorStore } from '../services/editor'
import { pickFunc } from '../services/pickFunc'

export const EditorBar: FunctionComponent<{
  onCleanLevel: () => void
}> = props => {
  const tool = useEditorStore(state => state.tool)
  const cameraScroll = useEditorStore(state => state.cameraScroll)
  const { setTool, slideCamera } = useEditorStore(pickFunc)
  return (
    <Navbar fixedToTop={true} className={Classes.DARK}>
      <NavbarGroup>
        <NavbarHeading>GSwitcher</NavbarHeading>
        <NavbarDivider />
        <Link to="/">
          <Button icon="play" intent="success" />
        </Link>
        <Button
          className="m-l-md"
          onClick={props.onCleanLevel}
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
      <NavbarGroup align="right">
        <Icon icon="camera" />
        <Slider
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
