import { NoteName } from '../utils/types'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
const octaves = ['0', '1', '2', '3', '4', '5'] as const
const noteNames: NoteName[] = []
for (const octave of octaves) {
    for (const note of notes) {
        noteNames.push(`${note}${octave}`)
    }
}

export function getNoteName(note: number): NoteName {
    return noteNames[note]
}

export function allNoteNames() {
    return noteNames
}
