import { ChordType } from '../utils/types'
import { store } from '../utils/store'
import { createDiatonic } from './diatonic'
import { randomNotes } from './random'
import { planedChord } from './planing'

export function createChord(): ChordType {
    if (store.state.algorithm === 'diatonic') return createDiatonic()
    if (store.state.algorithm === 'chord planing') return planedChord()
    if (store.state.algorithm === 'random') return randomNotes()
    return []
}

// TODO algorithm ideas:
// diatonic + extension options
// random with scale filter
// chord planing + chord type options
// ngram

// TODO voicing:
// spread
// cramp
