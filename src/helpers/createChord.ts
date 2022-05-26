import { ChordType } from '../utils/types'
import { Chord } from '@tonaljs/tonal'
import { getNoteName } from './getNoteName'
import consts from '../utils/consts'

export function createChord(): ChordType {
    return randomNotes(4)
}

function randomNotes(noteCount: number) {
    const chord: ChordType = []
    while (chord.length < noteCount) {
        const note = Math.floor(Math.random() * consts.numNotes) + consts.lowestNote
        if (!chord.includes(note)) chord.push(note)
    }
    const isValid = Chord.detect(chord.map(note => getNoteName(note)))[0]
    if (isValid) {
        return chord.sort((a, b) => a - b)
    } else {
        return createChord()
    }
}

// TODO algorithm ideas:
// diatonic + extension options
// random with scale filter
// chord planing + chord type options
// ngram

// TODO voicing:
// spread
// cramp
