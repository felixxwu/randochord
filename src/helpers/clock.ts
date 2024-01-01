import * as Tone from 'tone'
import { store } from '../utils/store'
import consts from '../utils/consts'

const tickListeners: ((time: number, division: number) => void)[] = []
let division = 0 // current division played in the beat

export const clock = new Tone.Clock({
  callback: time => {
    for (const tickListener of tickListeners) {
      tickListener(time, division)
    }
    division++
    if (isPowerOfTwoChordLength()) {
      // let the pattern run to the end (max 8 beats)
      if (division >= consts.beatDivisions * 8) resetDivision()
    } else {
      // if weird chord length (3,5,6,7) reset the divisions at every chord change
      if (division >= consts.beatDivisions * parseInt(store.state.chordLength)) resetDivision()
    }
  },
  units: 'bpm',
  frequency: consts.defaultBpm,
})

export function updateClockBpm() {
  clock.set({ frequency: (store.state.bpm / 4) * consts.beatDivisions * 4 })
}

export function onClockTick(callback: (time: number, division: number) => void) {
  tickListeners.push(callback)
}

export function resetDivision() {
  division = 0
}

function isPowerOfTwoChordLength() {
  return (
    store.state.chordLength === '1' ||
    store.state.chordLength === '2' ||
    store.state.chordLength === '4' ||
    store.state.chordLength === '8'
  )
}
