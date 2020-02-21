import { Key } from 'ts-keycode-enum'

export const START_X = -4.5

export const PLAYERS = [
  {
    name: 'M',
    startPoint: [START_X, -6],
    color: 'yellow',
    code: Key.M,
  },
  {
    name: 'X',
    startPoint: [START_X, -4.5],
    color: 'royalblue',
    code: Key.X,
  },
  {
    name: '→',
    startPoint: [START_X, -2],
    color: 'magenta',
    code: Key.RightArrow,
  },
  { name: 'A', startPoint: [START_X, -0.5], color: 'white', code: Key.A },
  { name: 'N', startPoint: [START_X, 2], color: 'orangered', code: Key.N },
  {
    name: '⇧',
    startPoint: [START_X, 3.5],
    color: 'teal',
    code: Key.Shift,
  },
] as const

export const PLAYER_WIDTH = 1
export const PLAYER_PADDING = 0.05
export const PLAYER_HEIGHT = 1.5 - 2 * PLAYER_PADDING
export const PLAYER_ANGLE = Math.PI / 4

export const LEVEL_LENGTH = 50

export const CAMERA_SPEED = 5
export const PLAYER_SPEED = CAMERA_SPEED / Math.cos(PLAYER_ANGLE)
export const BONUS_LEFTBEHIND = 0.15 * CAMERA_SPEED

export const BORDER_TOP = 7
export const BORDER_DOWN = -6
export const BORDER_LEFT = -12
export const BORDER_RIGHT = 8
