import produce from 'immer'
import create from 'zustand'
import * as cst from './constants'

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
  players: Array<{
    score: number
    finishedRace: boolean
  }>
  counter: number
  cameraScroll: number
  startRace: (config: RaceConfig) => void
  playersEndsMatch: (playerIndex: number, percent: number) => void
  startNextMatch: () => void
  updateCameraOnFrame: (delta: number) => void
}

const [useRaceStore, apiRaceStore] = create<RaceStore>((set, get) => {
  const store: RaceStore = {
    currentRace: 0,
    config: {
      numberPlayer: 0,
      numberMatch: 0,
    },
    phase: 'SELECT_MENU',
    players: [],
    counter: 3,
    cameraScroll: 0,
    startRace(config) {
      set(state =>
        produce(state, draft => {
          draft.config = config
          draft.phase = 'COUNTDOWN'
          draft.players = new Array(config.numberPlayer).map(() => ({
            score: 0,
            finishedRace: false,
          }))
        }),
      )
    },
    playersEndsMatch(playerIndex, percent) {
      set(state =>
        produce(state, draft => {
          const podium = state.players.filter(player => player.finishedRace)
            .length
          draft.players[playerIndex].score += percent + FinisherBonus[podium]
          draft.players[playerIndex].finishedRace = true
          if (podium === state.config.numberPlayer - 1) {
            draft.phase = 'RACE_RESULT'
          }
        }),
      )
    },
    startNextMatch() {
      set(state =>
        produce(state, draft => {
          draft.players = state.players.map(player => ({
            ...player,
            finishedRace: false,
          }))
          draft.phase = 'COUNTDOWN'
          draft.counter = 3
        }),
      )
      const counterTimer = window.setInterval(() => {
        set(state =>
          produce(state, draft => {
            if (state.counter >= 0 && state.phase === 'COUNTDOWN') {
              --draft.counter
            } else {
              window.clearInterval(counterTimer)
              draft.phase = 'RACING'
            }
          }),
        )
      }, 1000)
    },
    updateCameraOnFrame(deltaSecond) {
      const currentState = get()
      if (currentState.phase === 'RACING') {
        set(state =>
          produce(state, draft => {
            draft.cameraScroll += deltaSecond * cst.CAMERA_SPEED
          }),
        )
      }
    },
  }
  return store
})

export default useRaceStore

export { useRaceStore, apiRaceStore }
