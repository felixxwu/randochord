import { store } from '../utils/store'
import { playChord } from '../helpers/playback'
import consts from '../utils/consts'
import { ChordType } from '../utils/types'

let arpState = 0

export function playArpeggio(time: number, division: number) {
    if (store.state.currentlyPlayingChord === null) return
    const noteLength = getArpNoteLength()
    const chord = store.state.chords[store.state.currentlyPlayingChord]
    const shortDivision = division % (parseInt(store.state.chordLength) * consts.beatDivisions)
    if (shortDivision % noteLength === 0) {
        playArpeggioRise(time, division, chord)

        arpState++
        if (arpState >= chord.length) resetArpeggio()
    }
}

export function resetArpeggio() {
    arpState = 0
}

function playArpeggioRise(time: number, division: number, chord: ChordType) {
    const divisionLength = 60 / store.state.bpm / consts.beatDivisions
    playChord([chord[arpState]], time, divisionLength * getArpNoteLength())
}

function getArpNoteLength() {
    if (store.state.arpeggioSpeed === 'whole') return 4
    if (store.state.arpeggioSpeed === 'dotted') return 3
    if (store.state.arpeggioSpeed === 'half') return 2
    if (store.state.arpeggioSpeed === 'quarter') return 1
    return 4
}
