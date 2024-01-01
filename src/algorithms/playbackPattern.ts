import { store } from '../utils/store'
import consts from '../utils/consts'
import { playChord } from '../helpers/playback'
import { Pattern } from '../utils/types'

export function playChordPattern(time: number, division: number) {
  if (store.state.chordRhythm === 'every4') playEvery4(time, division)
  if (store.state.chordRhythm === 'every2') playEvery2(time, division)
  if (store.state.chordRhythm === 'every') playEveryBeat(time, division)
  if (store.state.chordRhythm === 'twice every') playTwiceEveryBeat(time, division)
  if (store.state.chordRhythm === 'dotted') playDotted(time, division)
}

function playEvery4(time: number, division: number) {
  playPattern(time, division, [
    { startBeat: 0, beats: 4 },
    { startBeat: 4, beats: 4 },
  ])
}

function playEvery2(time: number, division: number) {
  playPattern(time, division, [
    { startBeat: 0, beats: 2 },
    { startBeat: 2, beats: 2 },
    { startBeat: 4, beats: 2 },
    { startBeat: 6, beats: 2 },
  ])
}

function playEveryBeat(time: number, division: number) {
  playPattern(
    time,
    division,
    [...Array(8)].map((_, i) => ({ startBeat: i, beats: 1 }))
  )
}

function playTwiceEveryBeat(time: number, division: number) {
  playPattern(
    time,
    division,
    [...Array(16)].map((_, i) => ({ startBeat: i / 2, beats: 0.5 }))
  )
}

function playDotted(time: number, division: number) {
  playPattern(time, division, [
    { startBeat: 0, beats: 0.5 },
    { startBeat: 0.75, beats: 0.5 },
    { startBeat: 1.5, beats: 0.5 },
    { startBeat: 2.25, beats: 0.5 },
    { startBeat: 3, beats: 0.5 },
    { startBeat: 3.5, beats: 0.5 },
    { startBeat: 4, beats: 0.5 },
    { startBeat: 4.75, beats: 0.5 },
    { startBeat: 5.5, beats: 0.5 },
    { startBeat: 6.25, beats: 0.5 },
    { startBeat: 7, beats: 0.5 },
    { startBeat: 7.5, beats: 0.5 },
  ])
}

function playPattern(time: number, division: number, pattern: Pattern) {
  if (store.state.currentlyPlayingChord === null) return
  const chord = store.state.chords[store.state.currentlyPlayingChord]
  const definition = pattern.find(def => def.startBeat * consts.beatDivisions === division)
  if (definition) {
    const beatLength = 60 / store.state.bpm
    playChord(chord, time, definition.beats * beatLength - consts.timeBetweenChords)
  }
}
