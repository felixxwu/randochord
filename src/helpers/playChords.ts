import { store } from '../utils/store'
import { ChordType } from '../utils/types'
import { getNoteName } from './getNoteName'
import consts from '../utils/consts'
import { clock, onClockTick } from './clock'
import { releaseAll, synth } from './synth'

onClockTick(time => {
    const chordIndex = store.state.currentlyPlayingChord
    if (chordIndex === null) return

    const atEnd = chordIndex === store.state.chords.length - 1
    const newIndex = atEnd ? 0 : chordIndex + 1
    store.state.currentlyPlayingChord = newIndex

    playChord(store.state.chords[newIndex], time)
})

export function playChords() {
    if (store.state.chords.length <= 0) return
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
    chordRelease(chord, time + (duration ?? (60 / store.state.bpm) * 4 * consts.chordDuration))
}

export function chordAttack(chord: ChordType, time?: number) {
    releaseAll(time ? time - 0.01 : undefined)
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
