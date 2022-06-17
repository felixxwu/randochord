import { createStore } from 'truly-global-state'
import consts from './consts'
import {
    Algorithm,
    ArpeggioSpeed,
    ArpeggioType,
    ChordRhythm,
    ChordType,
    ExtensionType,
    ModeName,
    NoteName,
    Playback,
    RandomNoteCount,
    TabType,
} from './types'
import { updateClockBpm } from '../helpers/clock'

export const store = createStore(
    {
        trayOpen: false,
        masterVolume: consts.maxMasterVolume as number,
        bpm: consts.defaultBpm as number,
        chords: <ChordType[]>[],
        currentlyPlayingChord: <number | null>null,
        chordInClipboard: <number | null>null,
        darkMode: false,
        appWidth: window.innerWidth,
        appHeight: window.innerHeight,
        currentTab: <TabType>'midi',
        metronome: true,
        algorithm: <Algorithm>'diatonic',
        randomNoteCount: <RandomNoteCount>'4',
        diatonicKey: <NoteName>'D',
        diatonicMode: <ModeName>'6',
        extensions: <ExtensionType>'simple',
        playback: <Playback>'chords',
        chordRhythm: <ChordRhythm>'full',
        arpeggioType: <ArpeggioType>'rise',
        arpeggioSpeed: <ArpeggioSpeed>'eighth',
    },
    {
        localStorage: {
            keys: [
                'bpm',
                'masterVolume',
                'trayOpen',
                'darkMode',
                'currentTab',
                'metronome',
                'algorithm',
                'randomNoteCount',
                'diatonicKey',
                'diatonicMode',
                'extensions',
                'playback',
                'chordRhythm',
                'arpeggioType',
                'arpeggioSpeed',
            ],
        },
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
