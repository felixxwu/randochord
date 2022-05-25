import { createStore } from 'truly-global-state'
import consts from './consts'
import { ChordType, TabType } from './types'
import { updateClockBpm } from '../helpers/clock'

export const store = createStore(
    {
        trayOpen: false,
        masterVolume: consts.maxMasterVolume,
        bpm: consts.defaultBpm,
        chords: <ChordType[]>[],
        currentlyPlayingChord: <number | null>null,
        chordInClipboard: <number | null>null,
        darkMode: false,
        appWidth: window.innerWidth,
        appHeight: window.innerHeight,
        currentTab: <TabType>'midi',
        metronome: true,
    },
    {
        localStorage: { keys: ['bpm', 'masterVolume', 'trayOpen', 'darkMode', 'currentTab', 'metronome'] },
        undoRedo: { keys: ['chords'], useLocalStorage: true, maxLength: 1000 },
    }
)

export const compute = {
    get trayPosition() {
        return consts.trayPositions[store.state.trayOpen ? 1 : 0]
    },
    get theme() {
        return store.state.darkMode ? consts.darkTheme : consts.lightTheme
    },
    get unitSpaces() {
        return Math.max(consts.minBodyWidth, Math.min(store.state.chords.length + 1, consts.maxBodyWidth))
    },
    get bodyWidth() {
        return compute.unitSpaces * (consts.buttonWidth + consts.margin) + consts.margin
    },
}

export function onStoreUpdate() {
    updateClockBpm()
    makeCssVarsFromTheme()
}

function makeCssVarsFromTheme() {
    for (const key in compute.theme) {
        const k = key as keyof typeof compute.theme
        document.documentElement.style.setProperty(`--${key}`, `${compute.theme[k]}`)
    }
}
