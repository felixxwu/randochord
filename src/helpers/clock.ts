import * as Tone from 'tone'
import { store } from '../utils/store'

const tickListeners: ((time: number) => void)[] = []

export const clock = new Tone.Clock({
    callback: time => {
        for (const tickListener of tickListeners) {
            tickListener(time)
        }
    },
    units: 'bpm',
    frequency: 120,
})

export function updateClockBpm() {
    clock.set({ frequency: store.state.bpm / 4 })
}

export function onClockTick(callback: (time: number) => void) {
    tickListeners.push(callback)
}
