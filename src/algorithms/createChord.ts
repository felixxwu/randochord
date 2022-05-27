import { ChordType } from '../utils/types'
import { store } from '../utils/store'
import { createDiatonic } from './diatonic'
import { randomNotes } from './random'

export function createChord(): ChordType {
    if (store.state.algorithm === 'diatonic') return createDiatonic()
    return randomNotes()
}

// TODO algorithm ideas:
// diatonic + extension options
// random with scale filter
// chord planing + chord type options
// ngram

// TODO voicing:
// spread
// cramp
