import { NoteName } from '../utils/types'

const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'] as const
const octaves = ['3', '4', '5'] as const
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
