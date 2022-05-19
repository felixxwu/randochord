import { Midi, Track } from '@tonejs/midi'
import { ChordType } from '../utils/types'
import { store } from '../utils/store'

export function downloadMidi() {
    const midi = new Midi()
    const track = midi.addTrack()
    let i = 0
    for (const chord of store.state.chords) {
        addChord(track, chord, i * 2)
        i++
    }
    const blob = new Blob([midi.toArray()], { type: 'audio/mid' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'chords'
    link.click()
}

function addChord(track: Track, chord: ChordType, time: number) {
    for (const note of chord) {
        addNote(track, note, time)
    }
}

function addNote(track: Track, note: number, time: number) {
    track.addNote({
        midi: note + 12,
        time: time,
        duration: 2,
    })
}
