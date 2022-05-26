import { store } from '../utils/store'
import { ChordType } from '../utils/types'
import { getNoteName } from './getNoteName'
import consts from '../utils/consts'
import { clock, onClockTick } from './clock'
import { metronome, releaseAll, synth } from './synth'
import * as Tone from 'tone'

onClockTick(time => {
    const chordIndex = store.state.currentlyPlayingChord
    if (chordIndex === null) return

    const atEnd = chordIndex >= store.state.chords.length - 1
    const newIndex = atEnd ? 0 : chordIndex + 1
    store.state.currentlyPlayingChord = newIndex

    playChord(store.state.chords[newIndex], time)
})

export async function playChords() {
    if (store.state.chords.length <= 0) return
    await Tone.start()
    store.state.currentlyPlayingChord = -1
    clock.start()
}

export function stopChords() {
    clock.stop()
    releaseAll()
    store.state.currentlyPlayingChord = null
}

export function playChord(chord: ChordType, time: number, duration?: number) {
    chordAttack(chord, time)
    const chordEnd = time + (duration ?? (60 / store.state.bpm) * 4 * consts.chordDuration)
    const beat = 60 / store.state.bpm
    const downbeatVol = consts.metronomeVolume * (store.state.masterVolume / consts.maxMasterVolume)
    const upbeatVol = downbeatVol * consts.metronomeUpbeatVolume
    if (duration === undefined && store.state.metronome) {
        // playing from sequencer
        metronome.triggerAttack(['D5'], time, downbeatVol)
        metronome.triggerAttack(['A#4'], time + beat, upbeatVol)
        metronome.triggerAttack(['A#4'], time + beat * 2, upbeatVol)
        metronome.triggerAttack(['A#4'], time + beat * 3, upbeatVol)
    }
    chordRelease(chord, chordEnd)
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
