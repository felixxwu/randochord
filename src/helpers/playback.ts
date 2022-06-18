import { store } from '../utils/store'
import { ChordType } from '../utils/types'
import { getNoteName } from './getNoteName'
import consts from '../utils/consts'
import { clock, onClockTick, resetDivision } from './clock'
import { metronome, releaseAll, synth } from './synth'
import * as Tone from 'tone'
import { playChordPattern } from '../algorithms/playbackPattern'
import { playArpeggio, resetArpeggio } from '../algorithms/arpeggio'

onClockTick((time, division) => {
    const divisionsForOneChord = parseInt(store.state.chordLength) * consts.beatDivisions
    if (division % divisionsForOneChord === 0) {
        const chordIndex = store.state.currentlyPlayingChord
        if (chordIndex === null) return
        const atEnd = chordIndex >= store.state.chords.length - 1
        store.state.currentlyPlayingChord = atEnd ? 0 : chordIndex + 1
        resetArpeggio()
        if (atEnd) resetDivision()
    }

    // pattern requires the currentlyPlayingChord to be set before being called
    playMetronome(time, division)
    if (store.state.playback === 'chords') playChordPattern(time, division)
    if (store.state.playback === 'arpeggio') playArpeggio(time, division)
})

export async function playChords() {
    if (store.state.chords.length <= 0) return
    await Tone.start()
    store.state.currentlyPlayingChord = -1
    resetDivision()
    clock.start()
}

export function stopChords() {
    clock.stop()
    releaseAll()
    store.state.currentlyPlayingChord = null
}

export function playChord(chord: ChordType, time: number, duration: number) {
    chordAttack(chord, time)
    chordRelease(chord, time + duration)
}

export function playMetronome(time: number, division: number) {
    if (!store.state.metronome) return
    const downbeatVol = consts.metronomeVolume * (store.state.masterVolume / consts.maxMasterVolume)
    const upbeatVol = downbeatVol * consts.metronomeUpbeatVolume
    if (division === 0) {
        metronome.triggerAttack(['D5'], time, downbeatVol)
    } else if (division % consts.beatDivisions === 0) {
        metronome.triggerAttack(['A#4'], time, upbeatVol)
    }
}

export function previewChord(chord: ChordType) {
    if (store.state.currentlyPlayingChord === null) {
        playChord(chord, Tone.now(), consts.chordPreviewDuration)
    }
}

export function chordAttack(chord: ChordType, time?: number, release: boolean = true) {
    if (release) releaseAll()
    synth.triggerAttack(
        chord.map(note => getNoteName(note)),
        time,
        store.state.masterVolume / consts.maxMasterVolume
    )
}

export function chordRelease(chord: ChordType, time?: number) {
    synth.triggerRelease(
        chord.map(note => getNoteName(note)),
        time
    )
}
