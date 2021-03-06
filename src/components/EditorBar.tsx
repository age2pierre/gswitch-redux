import { Button } from '@blueprintjs/core/lib/esnext/components/button/buttons'
import { ButtonGroup } from '@blueprintjs/core/lib/esnext/components/button/buttonGroup'
import * as Classes from '@blueprintjs/core/lib/esnext/common/classes'
import { Icon } from '@blueprintjs/core/lib/esnext/components/icon/icon'
import { Navbar } from '@blueprintjs/core/lib/esnext/components/navbar/navbar'
import { NavbarDivider } from '@blueprintjs/core/lib/esnext/components/navbar/navbarDivider'
import { NavbarGroup } from '@blueprintjs/core/lib/esnext/components/navbar/navbarGroup'
import { NavbarHeading } from '@blueprintjs/core/lib/esnext/components/navbar/navbarHeading'
import { Slider } from '@blueprintjs/core/lib/esnext/components/slider/slider'
import React from 'react'
import { Tools } from '../services/editor'

interface EditorBarProps {
  /**
   * the tool selected either eraser or pencil
   */
  tool: Tools
  /**
   * handle changing tool in the store
   */
  onSetTool: (t: Tools) => void
  /**
   * current position of the camera proportionnaly to the level length
   */
  cameraScroll: number
  /**
   * handle the event slider to set the camera postion, cs is between 0 & 1
   */
  onSlideCamera: (cs: number) => void
  /**
   * handler for removing all blocks from the stage
   */
  onCleanLevel: () => void
  /**
   * handler start game and leave editor
   */
  onPlay: () => void
}

export const EditorBar: React.FC<EditorBarProps> = props => {
  return (
    <Navbar fixedToTop={true} className={Classes.DARK}>
      <NavbarGroup>
        <NavbarHeading>GSwitchRedux</NavbarHeading>
        <NavbarDivider />
        <Button onClick={props.onPlay} icon="play" intent="success" />
        <Button
          className="m-l-md"
          onClick={props.onCleanLevel}
          icon="clean"
          text="Clean level"
        />
        <ButtonGroup className="m-l-md">
          <Button
            icon="eraser"
            onClick={() => props.onSetTool('eraser')}
            active={props.tool === 'eraser'}
          />
          <Button
            icon="edit"
            onClick={() => props.onSetTool('pencil')}
            active={props.tool === 'pencil'}
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
          onChange={props.onSlideCamera}
          labelRenderer={false}
          value={props.cameraScroll}
        />
      </NavbarGroup>
    </Navbar>
  )
}
