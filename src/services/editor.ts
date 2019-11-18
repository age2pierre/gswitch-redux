import produce from 'immer'
import { create } from 'zustand'

export type Tools = 'eraser' | 'pencil'

export interface EditorStore {
  enabled: boolean
  tool: Tools
  cameraScroll: number
  setTool: (tool: Tools) => void
  switchMode: () => void
  slideCamera: (percent: number) => void
}

const [useEditorStore, apiEditorStore] = create<EditorStore>(set => {
  const store: EditorStore = {
    enabled: false,
    tool: 'pencil',
    cameraScroll: 0,
    setTool(tool) {
      set(state =>
        produce(state, draft => {
          draft.tool = tool
        }),
      )
    },
    switchMode() {
      set(state =>
        produce(state, draft => {
          draft.enabled = !state.enabled
        }),
      )
    },
    slideCamera(p) {
      set(state =>
        produce(state, draft => {
          draft.cameraScroll = p
        }),
      )
    },
  }
  return store
})

export default useEditorStore

export { useEditorStore, apiEditorStore }
