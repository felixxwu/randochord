import { ChordType } from '../utils/types'
import { Chord } from '@tonaljs/tonal'
import { getNoteName } from './getNoteName'
import consts from '../utils/consts'

export function createChord(): ChordType {
    const chord: ChordType = []
    while (chord.length < 4) {
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
