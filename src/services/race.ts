import produce from 'immer'
import create from 'zustand'

const RacePhase = [
  'SELECT_MENU',
  'COUNTDOWN',
  'RACING',
  'MATCH_RESULT',
  'RACE_RESULT',
] as const

const FinisherBonus = [10, 6, 4, 3, 2, 1] as const

interface RaceConfig {
  numberPlayer: number
  numberMatch: number
}

interface RaceStore {
  currentRace: number
  config: RaceConfig
  phase: typeof RacePhase[number]
  playersScore: number[]
  numberFinisher: number
  counter: number
  startRace: (config: RaceConfig) => void
  playersEndsMatch: (playerIndex: number, percent: number) => void
  startNextMatch: () => void
}

let counterTimer: number | undefined

const [useRaceStore, apiRaceStore] = create<RaceStore>((set, get) => {
  const store: RaceStore = {
    currentRace: 0,
    config: {
      numberPlayer: 0,
      numberMatch: 0,
    },
    phase: 'SELECT_MENU',
    playersScore: [],
    numberFinisher: 0,
    counter: 3,
    startRace(config) {
      set(state =>
        produce(state, draft => {
          draft.config = config
          draft.phase = 'COUNTDOWN'
        }),
      )
    },
    playersEndsMatch: (playerIndex, percent) => {
      set(state =>
        produce(state, draft => {
          draft.playersScore[playerIndex] +=
            percent + FinisherBonus[state.numberFinisher]
          ++draft.numberFinisher
          if (draft.numberFinisher === state.config.numberPlayer) {
            draft.phase = 'RACE_RESULT'
          }
        }),
      )
    },
    startNextMatch: () => {
      set(state =>
        produce(state, draft => {
          draft.phase = 'COUNTDOWN'
          draft.counter = 3
        }),
      )
      counterTimer = window.setInterval(() => {
        set(state =>
          produce(state, draft => {
            if (state.counter >= 0) {
              --draft.counter
            } else {
              window.clearInterval(counterTimer)
            }
          }),
        )
      }, 1000)
    },
  }
  return store
})

export default useRaceStore

export { useRaceStore, apiRaceStore }
