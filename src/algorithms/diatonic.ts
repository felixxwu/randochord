import { ChordType, ModeName, NoteName } from '../utils/types'
import { store } from '../utils/store'
import { getKeyOffset, getScale } from '../helpers/getNoteName'
import consts from '../utils/consts'
import { choose, normalise, revoice, transpose } from '../helpers/processNotes'

export function createDiatonic(): ChordType {
    if (store.state.extensions === 'none') return createDiatonicNoExtensions()
    if (store.state.extensions === 'simple') return createDiatonicSimple()
    return []
}

function createDiatonicNoExtensions() {
    const degree = Math.floor(Math.random() * 7)
    let chord = createTriad(store.state.diatonicKey, store.state.diatonicMode, degree)
    chord = normalise(chord)
    chord = transpose(chord, 12)
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    const root = getScale(store.state.diatonicMode)[degree] + keyOffset
    const fifth = getScale(store.state.diatonicMode)[degree + 4] + keyOffset
    const bassNote = (choose(root, fifth) % 12) + consts.lowestNote
    chord.push(bassNote)
    return chord
}

function createDiatonicSimple() {
    if (Math.random() > 0.5) return createDiatonicNoExtensions()
    const degree = Math.floor(Math.random() * 7)
    const chord = createTriad(store.state.diatonicKey, store.state.diatonicMode, degree)
    chord.push(getSeventh(degree))
    return revoice(chord)
}

function getSeventh(degree: number) {
    const seventh = getScale(store.state.diatonicMode)[degree + 6]
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    return seventh + keyOffset + consts.lowestNote
}

function createTriad(key: NoteName, mode: ModeName, degree: number) {
    const scale = getScale(mode)
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    return [
        consts.lowestNote + scale[degree] + keyOffset,
        consts.lowestNote + scale[degree + 2] + keyOffset,
        consts.lowestNote + scale[degree + 4] + keyOffset,
    ]
}
