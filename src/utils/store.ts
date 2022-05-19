import { createStore } from 'truly-global-state'
import consts from './consts'
import { ChordType } from './types'
import { updateClockBpm } from '../helpers/clock'

export const store = createStore({
    trayOpen: false,
    getTrayPosition() {
        return consts.trayPositions[this.trayOpen ? 1 : 0]
    },
    masterVolume: consts.maxMasterVolume,
    bpm: 120,
    chords: <ChordType[]>[],
    currentlyPlayingChord: <number | null>null,
})

export function onStoreUpdate() {
    updateClockBpm()
}
