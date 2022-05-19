import { createStore } from 'truly-global-state'
import consts from './consts'
import { ChordType } from './types'
import { updateClockBpm } from '../helpers/clock'
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage'

export const store = createStore({
    trayOpen: false,
    masterVolume: consts.maxMasterVolume,
    bpm: 120,
    chords: <ChordType[]>[],
    currentlyPlayingChord: <number | null>null,
    theme: consts.lightTheme,
})

loadFromLocalStorage()

export function onStoreUpdate() {
    saveToLocalStorage()
    updateClockBpm()
    document.documentElement.style.setProperty('--buttonColour', store.state.theme.buttonColour)
    document.documentElement.style.setProperty('--highlight', store.state.theme.highlight)
}

export type StoreType = typeof store.state

export function getTrayPosition() {
    return consts.trayPositions[store.state.trayOpen ? 1 : 0]
}
