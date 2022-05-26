import { MidiNoteName, NoteColour } from '../utils/types'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
const noteLabel = ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B'] as const
const colours = ['w', 'b', 'w', 'b', 'w', 'w', 'b', 'w,', 'b', 'w', 'b', 'w'] as NoteColour[]
const octaves = ['0', '1', '2', '3', '4', '5'] as const
const noteNames: MidiNoteName[] = []
for (const octave of octaves) {
    for (const note of notes) {
        noteNames.push(`${note}${octave}`)
    }
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
