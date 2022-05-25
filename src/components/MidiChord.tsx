import styled from 'styled-components'
import { ChordType } from '../utils/types'
import consts from '../utils/consts'
import React, { useRef } from 'react'
import { compute, store } from '../utils/store'
import { playChord } from '../helpers/playChords'
import * as Tone from 'tone'

export function MidiChord(props: { chord: ChordType; index: number }) {
    const chordRef = useRef<HTMLDivElement>(null)

    return (
        <MidiChordDiv onClick={handleClick} ref={chordRef}>
            {props.chord.map((note, i) => (
                <MidiNote style={noteStyle(note)} key={i} />
            ))}
        </MidiChordDiv>
    )

    function handleClick(event: React.MouseEvent) {
        if (chordRef.current === null) return
        const rect = chordRef.current.getBoundingClientRect()
        const percentFromTop = (event.clientY - rect.top) / rect.height
        const posFromTop = Math.floor(percentFromTop * consts.numNotes)
        const note = consts.lowestNote + consts.numNotes - posFromTop - 1
        if (props.chord.includes(note)) {
            store.state.chords[props.index] = props.chord.filter(n => n !== note)
        } else {
            store.state.chords[props.index].push(note)
        }
        playChord(store.state.chords[props.index], Tone.now(), consts.chordPreviewDuration)
        store.saveHistory()
    }

    function noteStyle(note: number): React.CSSProperties {
        const noteHeight = consts.trayContentHeight / consts.numNotes
        const notesFromTop = consts.lowestNote + consts.numNotes - note
        return {
            backgroundColor: compute.theme.midiNoteColour,
            top: (notesFromTop - 1) * noteHeight,
        }
    }
}

const MidiChordDiv = styled.div`
    z-index: 1;
    width: ${consts.buttonWidth + consts.margin}px;
`

const MidiNote = styled.div`
    position: absolute;
    height: ${consts.trayContentHeight / consts.numNotes}px;
    width: ${consts.buttonWidth}px;
    border-radius: ${consts.midiNoteBorderRadius}px;
`
