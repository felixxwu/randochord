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
    if (store.state.arpeggioType === 'rise') playArpeggioRise(time, division, chord)
    if (store.state.arpeggioType === 'fall') playArpeggioFall(time, division, chord)
    if (store.state.arpeggioType === 'rise and fall') playArpeggioRiseAndFall(time, division, chord)
    if (store.state.arpeggioType === 'random') playArpeggioRandom(time, chord)
  }
}

export function resetArpeggio() {
  arpState = 0
}

function playArpeggioRise(time: number, division: number, chord: ChordType) {
  const divisionLength = 60 / store.state.bpm / consts.beatDivisions
  playChord([chord[arpState]], time, divisionLength * getArpNoteLength())
  arpState++
  if (arpState >= chord.length) resetArpeggio()
}

function playArpeggioFall(time: number, division: number, chord: ChordType) {
  const divisionLength = 60 / store.state.bpm / consts.beatDivisions
  playChord([chord[chord.length - 1 - arpState]], time, divisionLength * getArpNoteLength())
  arpState++
  if (arpState >= chord.length) resetArpeggio()
}

function playArpeggioRiseAndFall(time: number, division: number, chord: ChordType) {
  const divisionLength = 60 / store.state.bpm / consts.beatDivisions
  if (arpState < chord.length) {
    playChord([chord[arpState]], time, divisionLength * getArpNoteLength())
  } else {
    playChord([chord[chord.length * 2 - 1 - arpState]], time, divisionLength * getArpNoteLength())
  }
  arpState++
  if (arpState >= chord.length * 2) resetArpeggio()
}

function playArpeggioRandom(time: number, chord: ChordType) {
  const divisionLength = 60 / store.state.bpm / consts.beatDivisions
  const index = Math.floor(Math.random() * chord.length)
  playChord([chord[index]], time, divisionLength * getArpNoteLength())
}

function getArpNoteLength() {
  if (store.state.arpeggioSpeed === 'whole') return 4
  if (store.state.arpeggioSpeed === 'dotted') return 3
  if (store.state.arpeggioSpeed === 'half') return 2
  if (store.state.arpeggioSpeed === 'quarter') return 1
  return 4
}
