import { ChordType } from '../utils/types'
import consts from '../utils/consts'

export function revoice(chord: ChordType): ChordType {
    return chord.map(note => {
        const actions = ['down', 'nothing', 'up'] as const
        const action = actions[Math.floor(Math.random() * 3)]
        const tooLow = note - 12 < consts.lowestNote
        const tooHigh = note + 12 >= consts.highestNote
        if (action === 'down' && !tooLow) return note - 12
        if (action === 'up' && !tooHigh) return note + 12
        if (action === 'nothing') return note
        return note
    })
}

export function normalise(chord: ChordType) {
    return chord.map(note => (note % 12) + consts.lowestNote)
}

export function transpose(chord: ChordType, amount: number) {
    return chord.map(note => note + amount)
}
