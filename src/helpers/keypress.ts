import { store } from '../utils/store'
import { chordAttack, chordRelease } from './playback'

let keysDown: number[] = []

const keys: { [key: string]: number } = {
    z: 36,
    s: 37,
    x: 38,
    d: 39,
    c: 40,
    v: 41,
    g: 42,
    b: 43,
    h: 44,
    n: 45,
    j: 46,
    m: 47,
    ',': 48,
    l: 49,
    '.': 50,
    ';': 51,
    '/': 52,
    q: 48,
    2: 49,
    w: 50,
    3: 51,
    e: 52,
    r: 53,
    5: 54,
    t: 55,
    6: 56,
    y: 57,
    7: 58,
    u: 59,
}

export function handleKeydown(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    if (event.ctrlKey) {
        handleCtrlPress(key, event)
        return
    }
    const note = keys[key]
    if (note && !keysDown.includes(note)) {
        keysDown.push(note)
        chordAttack([note], undefined, false)
    }
}

export function handleKeyup(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    const note = keys[key]
    if (note) {
        keysDown = keysDown.filter(n => n !== note)
        chordRelease([note])
    }
}

function handleCtrlPress(key: string, event: KeyboardEvent) {
    if (key === 'z' && event.shiftKey) store.redo()
    if (key === 'z' && !event.shiftKey) store.undo()
    if (key === 'y') store.redo()
}
