import { Button } from './Button'
import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import add from '../images/add.svg'
import { createChord } from '../helpers/createChord'
import { store } from '../utils/store'
import { playChord } from '../helpers/playChords'
import * as Tone from 'tone'
import { saveHistory } from '../utils/undo'

export function AddChord() {
    if (store.state.chords.length >= consts.maxBodyWidth) return <></>

    return (
        <ChordDiv>
            <Button onClick={handleClick} icon={add} small={false} />
        </ChordDiv>
    )

    function handleClick() {
        const chord = createChord()
        store.state.chords.push(chord)
        playChord(chord, Tone.now(), consts.chordPreviewDuration)
        saveHistory()
    }
}

const ChordDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: ${consts.smallButtonHeight + consts.margin}px;

    > * + * {
        margin-top: ${consts.margin}px;
    }
`
