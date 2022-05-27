import { ChordType } from '../utils/types'
import consts from '../utils/consts'

export function revoice(chord: ChordType): ChordType {
    const revoiced = normalise(chord).map(note => {
        const actions = ['nothing', 'up'] as const
        const action = actions[Math.floor(Math.random() * 2)]
        const tooHigh = note + 12 >= consts.highestNote
        if (action === 'up' && !tooHigh) return note + 12
        if (action === 'nothing') return note
        return note
    })
    return [...new Set(revoiced)]
}

export function normalise(chord: ChordType) {
    return chord.map(note => (note % 12) + consts.lowestNote)
}

export function transpose(chord: ChordType, amount: number) {
    return chord.map(note => note + amount)
}

export function wrap(chord: ChordType) {
    const zeroStart = transpose(chord, -consts.lowestNote)
    const wrapped = zeroStart.map(note => note % consts.numNotes)
    return transpose(wrapped, consts.lowestNote)
}

export function choose(a: number, b: number) {
    return Math.random() > 0.5 ? a : b
}
