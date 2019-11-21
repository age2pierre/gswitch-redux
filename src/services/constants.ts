import { Key } from 'ts-keycode-enum'

export const ANIM_TO_COLORS = {
  idle: 'cyan',
  running: 'red',
  falling: 'blue',
  spinning: 'yellow',
} as const

export const START_LINE_X = -4.5
export const PLAYER_STARTING_POINTS = [
  [START_LINE_X, -5 - 0.25],
  [START_LINE_X, -3.5 - 0.25],
  [START_LINE_X, -1 - 0.25],
  [START_LINE_X, 0.5 - 0.25],
  [START_LINE_X, 3 - 0.25],
  [START_LINE_X, 4.5 - 0.25],
] as const

export const PLAYER_KEYMAP = [
  Key.M,
  Key.X,
  Key.RightArrow,
  Key.A,
  Key.N,
  Key.Shift,
] as const

export const PLAYER_WIDTH = 1
export const PLAYER_HEIGHT = 1.4
export const PLAYER_ANGLE = Math.PI / 4

export const LEVEL_LENGTH = 50

export const CAMERA_SPEED = 5
export const PLAYER_SPEED = CAMERA_SPEED / Math.cos(PLAYER_ANGLE)
export const BONUS_LEFTBEHIND = 0.15 * CAMERA_SPEED

export const BORDER_TOP = 7
export const BORDER_DOWN = -6
export const BORDER_LEFT = -12
export const BORDER_RIGHT = 8
