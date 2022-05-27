import { ChordType, ModeName, NoteName } from '../utils/types'
import { store } from '../utils/store'
import { getKeyOffset, getScale } from '../helpers/getNoteName'
import consts from '../utils/consts'
import { normalise, transpose } from '../helpers/processNotes'

export function createDiatonic() {
    if (store.state.extensions === 'none') return createDiatonicNoExtensions()
    return []
}

function createDiatonicNoExtensions() {
    const degree = Math.floor(Math.random() * 7)
    const chord: ChordType = []
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    const triad = createTriad(store.state.diatonicKey, store.state.diatonicMode, degree)
    const normalised = transpose(normalise(triad), 12)
    chord.push(...normalised)
    chord.push(((getScale(store.state.diatonicMode)[degree] + keyOffset) % 12) + consts.lowestNote)
    return chord
}

function createTriad(key: NoteName, mode: ModeName, degree: number) {
    const scale = getScale(mode)
    const keyOffset = getKeyOffset(store.state.diatonicKey)
    return [
        consts.lowestNote + scale[degree % 7] + keyOffset,
        consts.lowestNote + scale[(2 + degree) % 7] + keyOffset,
        consts.lowestNote + scale[(4 + degree) % 7] + keyOffset,
    ]
}
