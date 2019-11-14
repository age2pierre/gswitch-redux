import { PickByValue } from 'utility-types'

// tslint:disable-next-line: ban-types
export default function pickFunc<S>(state: S): PickByValue<S, Function> {
  return Object.fromEntries(
    Object.entries(state).filter(([_, v]) => typeof v === 'function'),
    // tslint:disable-next-line: ban-types
  ) as PickByValue<S, Function>
}
