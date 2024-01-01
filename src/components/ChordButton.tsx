import { Button } from './Button'
import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import { ChordType, MenuList } from '../utils/types'
import { chordAttack, chordRelease, previewChord } from '../helpers/playback'
import { store } from '../utils/store'
import { createChord } from '../algorithms/createChord'
import { Chord } from '@tonaljs/tonal'
import { getNoteName, isSameChord } from '../helpers/getNoteName'
import shuffle from '../images/shuffle.svg'
import { copy, paste } from '../helpers/copyChord'
import { revoice } from '../helpers/processNotes'

export function ChordButton(props: { chord: ChordType; index: number }) {
  return (
    <ChordDiv>
      <Button
        text={getChordText()}
        small={false}
        onPointerDown={handlePlay}
        onPointerUp={handleStop}
        highlighted={isCurrentlyPlaying()}
        outline={props.index === store.state.chordInClipboard}
        menu={menu()}
        title='Right click for options'
      />
      <Button
        icon={shuffle}
        small={true}
        onClick={handleRetry}
        highlighted={isCurrentlyPlaying()}
        title='Randomise chord'
      />
    </ChordDiv>
  )

  function isCurrentlyPlaying() {
    if (store.state.currentlyPlayingChord === null) return false
    return store.state.currentlyPlayingChord === props.index
  }

  function handlePlay() {
    if (store.state.currentlyPlayingChord !== null) return
    chordAttack(props.chord)
  }

  function handleStop() {
    if (store.state.currentlyPlayingChord !== null) return
    chordRelease(props.chord)
  }

  function handleRetry() {
    let chord
    let attempts = 0
    do {
      chord = createChord()
      attempts++
    } while (isSameChord(chord, store.state.chords[props.index]) && attempts < 10)
    store.state.chords[props.index] = chord
    store.saveHistory()
    previewChord(chord)
  }

  function getChordText() {
    if (props.chord.length === 0) return '-'
    const options = Chord.detect(
      props.chord
        .slice()
        .sort()
        .map(note => getNoteName(note))
    )
    return options[0] ?? '?'
  }

  function menu(): MenuList {
    return [
      { text: 'Revoice', callback: revoiceChord },
      { text: 'Delete', callback: deleteChord },
      { text: 'Copy', callback: () => copy(props.index) },
      { text: 'Paste', callback: () => paste(props.index) },
      isLeftMost() ? null : { text: 'Move Left', callback: moveChordLeft },
      isRightMost() ? null : { text: 'Move Right', callback: moveChordRight },
    ]
  }

  function deleteChord() {
    store.state.chords.splice(props.index, 1)
    store.saveHistory()
  }

  function revoiceChord() {
    store.state.chords[props.index] = revoice(store.state.chords[props.index])
    store.saveHistory()
    previewChord(store.state.chords[props.index])
  }

  function isLeftMost() {
    return props.index === 0
  }

  function isRightMost() {
    return props.index === store.state.chords.length - 1
  }

  function moveChordLeft() {
    if (isLeftMost()) return
    const chord = store.state.chords[props.index]
    store.state.chords[props.index] = store.state.chords[props.index - 1]
    store.state.chords[props.index - 1] = chord
    store.saveHistory()
  }

  function moveChordRight() {
    if (isRightMost()) return
    const chord = store.state.chords[props.index]
    store.state.chords[props.index] = store.state.chords[props.index + 1]
    store.state.chords[props.index + 1] = chord
    store.saveHistory()
  }
}

const ChordDiv = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: ${consts.margin}px;
  }
`
