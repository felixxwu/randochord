import { Button } from './Button'
import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import { ChordType } from '../utils/types'
import { chordAttack, chordRelease, playChord } from '../helpers/playChords'
import { store } from '../utils/store'
import { createChord } from '../helpers/createChord'
import { Chord } from '@tonaljs/tonal'
import { getNoteName } from '../helpers/getNoteName'
import * as Tone from 'tone'
import shuffle from '../images/shuffle.svg'

export function ChordButton(props: { chord: ChordType; index: number }) {
    return (
        <ChordDiv>
            <Button
                icon={shuffle}
                small={true}
                onClick={handleRetry}
                highlighted={isCurrentlyPlaying()}
            />
            <Button
                text={getChordText()}
                small={false}
                onPointerDown={handlePlay}
                onPointerUp={handleStop}
                highlighted={isCurrentlyPlaying()}
            />
        </ChordDiv>
    )

    function isCurrentlyPlaying() {
        if (store.state.currentlyPlayingChord === null) return false
        return store.state.currentlyPlayingChord === props.index
    }

    function handlePlay() {
        chordAttack(props.chord)
    }

    function handleStop() {
        chordRelease(props.chord)
    }

    function handleRetry() {
        const chord = createChord()
        store.state.chords[props.index] = chord
        playChord(chord, Tone.now(), consts.chordPreviewDuration)
    }

    function getChordText() {
        const options = Chord.detect(props.chord.map(note => getNoteName(note)))
        return options[0] ?? '?'
    }
}

const ChordDiv = styled.div`
    display: flex;
    flex-direction: column;

    > * + * {
        margin-top: ${consts.margin}px;
    }
`
