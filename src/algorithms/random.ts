import { ChordType } from '../utils/types'
import { store } from '../utils/store'
import consts from '../utils/consts'
import { Chord } from '@tonaljs/tonal'
import { getNoteName } from '../helpers/getNoteName'
import { createChord } from './createChord'

export function randomNotes() {
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
