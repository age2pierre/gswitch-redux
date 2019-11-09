import { isEqual, uniqWith } from 'lodash-es'

export interface Block {
  x: number
  y: number
}

export interface BlockState {
  items: Block[]
}

export type BlockAction =
  | { type: 'add_block'; x: number; y: number }
  | { type: 'delete_block'; x: number; y: number }

export default function blockReducer(
  state: BlockState,
  action: BlockAction,
): BlockState {
  const { x, y } = action
  switch (action.type) {
    case 'add_block':
      return {
        ...state,
        items: uniqWith<Block>([...state.items, { x, y }], isEqual),
      }
    case 'delete_block':
      return {
        ...state,
        items: state.items.filter((item) => x !== item.x && y !== item.y),
      }
  }
}
