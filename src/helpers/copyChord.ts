import { ChordType } from '../utils/types'
import { store } from '../utils/store'

let clipboard: ChordType | null = null

export function copy(index: number) {
  clipboard = store.state.chords[index]
  store.state.chordInClipboard = index
}

export function paste(index: number) {
  if (clipboard !== null) {
    store.state.chords[index] = clipboard
    store.state.chordInClipboard = null
    store.saveHistory()
  }
}
