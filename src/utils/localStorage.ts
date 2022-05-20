import { store, StoreType } from './store'

type StorageConfig = { [key in keyof StoreType]: boolean }

// define which store keys should be saved in localstorage
const config: StorageConfig = {
    bpm: true,
    currentlyPlayingChord: false,
    chords: false,
    masterVolume: true,
    trayOpen: true,
    darkMode: true,
}

export function saveToLocalStorage<K extends keyof StoreType>() {
    for (const k in config) {
        const key = k as K
        if (config[key]) {
            localStorage.setItem(key, JSON.stringify(store.state[key]))
        }
    }
}

export function loadFromLocalStorage<K extends keyof StoreType>() {
    for (const k in config) {
        const key = k as K
        if (config[key]) {
            const valueString = localStorage.getItem(key)
            if (valueString !== null) {
                store.state[key] = JSON.parse(valueString)
            }
        }
    }
}
