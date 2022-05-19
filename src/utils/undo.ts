import { store, StoreType } from './store'

type HistoryConfig = { [key in keyof StoreType]: boolean }
type History = {
    position: number
    states: Partial<StoreType>[]
}

const storageKey = 'history'

// define which store keys should have undo/redo history
const config: HistoryConfig = {
    bpm: false,
    currentlyPlayingChord: false,
    chords: true,
    masterVolume: false,
    trayOpen: false,
    theme: false,
}

function getCurrentState<K extends keyof StoreType>() {
    const state: Partial<StoreType> = {}
    for (const k in config) {
        const key = k as K
        if (config[key]) {
            // store key should be saved to history
            state[key] = store.state[key]
        }
    }
    return state
}

export function getHistory(): History {
    const history = localStorage.getItem(storageKey)
    if (history === null)
        return {
            position: 0,
            states: [],
        }
    return JSON.parse(history) as History
}

export function saveHistory() {
    const history = getHistory()
    history.states = history.states.slice(0, history.position + 1)
    history.states.push(getCurrentState())
    history.position = history.states.length - 1
    localStorage.setItem(storageKey, JSON.stringify(history))
}

export function undo() {
    const history = getHistory()
    if (history.position > 0) {
        history.position--
    }
    localStorage.setItem(storageKey, JSON.stringify(history))
    loadHistory()
}

export function redo() {
    const history = getHistory()
    if (history.position < history.states.length - 1) {
        history.position++
    }
    localStorage.setItem(storageKey, JSON.stringify(history))
    loadHistory()
}

export function initHistory() {
    console.log(`initHistory`)
    const history = getHistory()
    console.log(`history.states.length`, history.states.length)
    if (history.states.length <= 0) {
        saveHistory()
    } else {
        loadHistory()
    }
}

function loadHistory<K extends keyof StoreType>() {
    const history = getHistory()
    if (history.states.length <= 0) return
    const state = history.states[history.position]
    for (const k in state) {
        const key = k as K
        store.state[key] = state[key]!
    }
}
