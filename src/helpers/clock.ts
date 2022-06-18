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
        if (division >= consts.beatDivisions * 8) division = 0
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
