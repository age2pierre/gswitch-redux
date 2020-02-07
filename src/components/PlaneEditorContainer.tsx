import React from 'react'
import { useEditorStore } from '../services/editor'
import { useLevelStore } from '../services/level'
import { pickFunc } from '../services/pickFunc'
import { PlaneEditor } from './PlaneEditor'

export const PlaneEditorContainer = () => {
  const tool = useEditorStore(state => state.tool)
  const { addBlock, deleteBlock } = useLevelStore(pickFunc)
  return (
    <PlaneEditor
      onClick={({ point }) => {
        const [x, y] = [Math.round(point.x - 0.5), Math.round(point.y - 0.5)]
        if (tool === 'pencil') {
          addBlock({
            x,
            y,
          })
        } else if (tool === 'eraser') {
          deleteBlock({
            x,
            y,
          })
        }
      }}
    />
  )
}
