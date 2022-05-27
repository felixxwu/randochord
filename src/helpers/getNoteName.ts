import { ChordType, MidiNoteName, ModeName, NoteColour, NoteName } from '../utils/types'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
const noteLabel = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B'] as const
const colours = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w,', 'b', 'w', 'b', 'w'] as NoteColour[]
const octaves = ['0', '1', '2', '3', '4', '5'] as const
const majorScale = [0, 2, 4, 5, 7, 9, 11]
const noteNames: MidiNoteName[] = []
for (const octave of octaves) {
    for (const note of notes) {
        noteNames.push(`${note}${octave}`)
    }
}

export function getScale(mode: ModeName) {
    const scale = []
    const startPos = parseInt(mode) - 1
    for (let i = startPos; i < startPos + 7; i++) {
        if (i < 7) {
            scale.push(majorScale[i] - majorScale[startPos])
        } else {
            scale.push(majorScale[i - 7] + 12 - majorScale[startPos])
        }
    }
    const doubleScale = scale.slice()
    for (const note of scale) {
        doubleScale.push(note + 12)
    }
    return doubleScale
}

export function getNoteName(note: number): MidiNoteName {
    return noteNames[note]
}

export function allNoteNames() {
    return noteNames
}

export function getNoteColour(note: number): NoteColour {
    return colours[note % 12]
}

export function getNoteLabelAndNames() {
    return [...Array(12).keys()].map(i => ({
        name: notes[i],
        label: noteLabel[i],
    }))
}

export function getKeyOffset(noteName: NoteName) {
    return notes.findIndex(name => name === noteName)
}

export function isSameChord(chord1: ChordType, chord2: ChordType) {
    return JSON.stringify(chord1.slice().sort()) === JSON.stringify(chord2.slice().sort())
}
