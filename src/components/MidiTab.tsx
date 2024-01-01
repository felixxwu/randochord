import styled from 'styled-components'
import React from 'react'
import { Keyboard } from './Keyboard'
import { PianoRoll } from './PIanoRoll'
import { MidiChord } from './MidiChord'
import { store } from '../utils/store'

export function MidiTab() {
  return (
    <MidiTabDiv>
      <Keyboard />
      <PianoRoll />
      {store.state.chords.map((chord, i) => (
        <MidiChord chord={chord} index={i} key={i} />
      ))}
    </MidiTabDiv>
  )
}

const MidiTabDiv = styled.div`
  display: flex;
  height: 100%;
`
