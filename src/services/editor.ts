import produce from 'immer'
import { create } from 'zustand'

export type Tools = 'eraser' | 'pencil'

export interface EditorStore {
  enabled: boolean
  tool: Tools
  setTool: (tool: Tools) => void
  switchMode: () => void
}

const [useEditorStore, apiEditorStore] = create<EditorStore>(set => {
  const store: EditorStore = {
    enabled: false,
    tool: 'pencil',
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
  }
  return store
})

export default useEditorStore

export { useEditorStore, apiEditorStore }
