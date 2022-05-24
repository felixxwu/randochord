import { createStore } from 'truly-global-state'
import consts from './consts'
import { ChordType } from './types'
import { updateClockBpm } from '../helpers/clock'

export const store = createStore(
    {
        trayOpen: false,
        masterVolume: consts.maxMasterVolume,
        bpm: 120,
        chords: <ChordType[]>[],
        currentlyPlayingChord: <number | null>null,
        chordInClipboard: <number | null>null,
        darkMode: false,
        appWidth: window.innerWidth,
        appHeight: window.innerHeight,
    },
    {
        localStorage: { keys: ['bpm', 'masterVolume', 'trayOpen', 'darkMode'] },
        undoRedo: { keys: ['chords'], useLocalStorage: true, maxLength: 1000 },
    }
)

export function onStoreUpdate() {
    updateClockBpm()
    makeCssVarsFromTheme()
}

export function getTrayPosition() {
    return consts.trayPositions[store.state.trayOpen ? 1 : 0]
}

export function getTheme() {
    return store.state.darkMode ? consts.darkTheme : consts.lightTheme
}

function makeCssVarsFromTheme() {
    const theme = getTheme()
    for (const key in theme) {
        const k = key as keyof typeof theme
        document.documentElement.style.setProperty(`--${key}`, `${theme[k]}`)
    }
}
