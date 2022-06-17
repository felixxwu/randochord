import { ChordPlaningType, ChordType } from '../utils/types'
import { store } from '../utils/store'
import { transpose, wrap } from '../helpers/processNotes'
import consts from '../utils/consts'

const chordPlaningChords: { [key in Exclude<ChordPlaningType, 'copy'>]: ChordType } = {
    maj: [0, 4, 7],
    maj7: [0, 4, 7, 11],
    maj9: [0, 4, 7, 14],
    maj11: [0, 4, 7, 14, 17],
    min: [0, 3, 7],
    min7: [0, 3, 7, 10],
    min9: [0, 3, 7, 10, 14],
    min11: [0, 3, 7, 10, 14, 17],
}

export function planedChord() {
    if (store.state.chordPlaningType === 'copy') {
        return [0]
    } else {
        const offset = Math.floor(Math.random() * 12)
        const chord = transpose(chordPlaningChords[store.state.chordPlaningType], consts.lowestNote)
        return wrap(transpose(chord, offset))
    }
}
