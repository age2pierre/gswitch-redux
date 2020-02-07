import React from 'react'
import { useHistory } from 'react-router-dom'
import { useEditorStore } from '../services/editor'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { EditorBar } from './EditorBar'
export const EditorBarContainer = () => {
  const tool = useEditorStore(state => state.tool)
  const cameraScroll = useEditorStore(state => state.cameraScroll)
  const { setTool, slideCamera } = useEditorStore(pickFunc)
  const history = useHistory()
  const { clear } = useLevelStore(pickFunc)
  return (
    <EditorBar
      tool={tool}
      cameraScroll={cameraScroll}
      onSetTool={setTool}
      onSlideCamera={slideCamera}
      onCleanLevel={clear}
      onPlay={() => history.push('/')}
    />
  )
}
