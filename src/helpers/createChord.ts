import { ChordType, ModeName, NoteName } from '../utils/types'
import { Chord } from '@tonaljs/tonal'
import { getKeyOffset, getNoteName, getScale } from './getNoteName'
import consts from '../utils/consts'
import { store } from '../utils/store'

export function createChord(): ChordType {
    if (store.state.algorithm === 'diatonic') return createDiatonic()
    return randomNotes()
}

function createDiatonic() {
    const degree = Math.floor(Math.random() * 7)
    return createTriad(store.state.diatonicKey, store.state.diatonicMode, degree)
}

function createTriad(key: NoteName, mode: ModeName, degree: number) {
    const scale = getScale(mode)
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    return [
        36 + scale[degree % 7] + keyOffset,
        36 + scale[(2 + degree) % 7] + keyOffset,
        36 + scale[(4 + degree) % 7] + keyOffset,
    ]
}

function randomNotes() {
    const chord: ChordType = []
    while (chord.length < parseInt(store.state.randomNoteCount)) {
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
