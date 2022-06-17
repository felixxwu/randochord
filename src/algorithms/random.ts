import { ChordType } from '../utils/types'
import { store } from '../utils/store'
import consts from '../utils/consts'
import { Chord } from '@tonaljs/tonal'
import { getKeyOffset, getNoteName, getScale } from '../helpers/getNoteName'
import { createChord } from './createChord'
import { normalise, transpose, wrap } from '../helpers/processNotes'

export function randomNotes() {
    const chord: ChordType = []
    while (chord.length < parseInt(store.state.randomNoteCount)) {
        const note = Math.floor(Math.random() * consts.numNotes) + consts.lowestNote
        if (store.state.randomFilterKey !== '') {
            const scale = getScale(store.state.diatonicMode)
            const keyOffset = getKeyOffset(store.state.randomFilterKey)
            const transposedScale = wrap(transpose(scale, keyOffset))
            const normalisedScale = normalise(transposedScale)
            const normalisedNote = normalise([note])[0]
            if (!normalisedScale.includes(normalisedNote)) continue
        }
        if (!chord.includes(note)) chord.push(note)
    }
    const isValid = Chord.detect(chord.map(note => getNoteName(note)))[0]
    if (isValid) {
        return chord.sort((a, b) => a - b)
    } else {
        return createChord()
    }
}
