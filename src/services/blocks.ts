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

const [useBlocksStore, apiBlocksStore] = create<BlockStore>(set => {
  const store: BlockStore = {
    items: [],
    addBlock({ x, y }) {
      set(state => ({
        ...state,
        items: uniqWith<Block>([...state.items, { x, y }], isEqual),
      }))
    },
    deleteBlock({ x, y }) {
      set(state => ({
        ...state,
        items: state.items.filter(item => x !== item.x && y !== item.y),
      }))
    },
  }
  return store
})

export default useBlocksStore

export { useBlocksStore, apiBlocksStore }
