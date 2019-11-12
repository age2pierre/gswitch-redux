import { isEqual, uniqWith } from 'lodash-es'
import create from 'zustand'

export interface Block {
  x: number
  y: number
}

export interface BlockStore {
  items: Block[]
  addBlock: (args: Block) => void
  deleteBlock: (args: Block) => void
}

const [useStore, api] = create<BlockStore>((set) => {
  const store: BlockStore = {
    items: [],
    addBlock({ x, y }: Block) {
      set((state) => ({
        ...state,
        items: uniqWith<Block>([...state.items, { x, y }], isEqual),
      }))
    },
    deleteBlock({ x, y }: Block) {
      set((state) => ({
        ...state,
        items: state.items.filter((item) => x !== item.x && y !== item.y),
      }))
    },
  }
  return store
})

export default useStore

export { useStore, api }
