import { useEffect } from 'react'
import { Key } from 'ts-keycode-enum'

export function useKeyboard(
  keycode: Key,
  event: 'keydown' | 'keyup',
  callback: (ev: KeyboardEvent) => void,
) {
  function handler(ev: KeyboardEvent) {
    if (ev.keyCode === keycode) {
      callback(ev)
    }
  }
  return useEffect(() => {
    window.addEventListener(event, handler)
    return () => {
      window.removeEventListener(event, handler)
    }
  })
}
