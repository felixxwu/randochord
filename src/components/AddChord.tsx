import { Button } from './Button'
import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import add from '../images/add.svg'
import { createChord } from '../algorithms/createChord'
import { store } from '../utils/store'
import { previewChord } from '../helpers/playback'

export function AddChord() {
  if (store.state.chords.length >= consts.maxBodyWidth) return <></>

  return (
    <ChordDiv>
      <Button onClick={handleClick} icon={add} small={false} title='Add new chord' />
    </ChordDiv>
  )

  function handleClick() {
    const chord = createChord()
    store.state.chords.push(chord)
    previewChord(chord)
    store.saveHistory()
  }
}

const ChordDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: ${consts.smallButtonHeight + consts.margin}px;

  > * + * {
    margin-top: ${consts.margin}px;
  }
`
