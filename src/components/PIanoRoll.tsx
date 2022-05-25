import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'
import React from 'react'
import { getNoteColour } from '../helpers/getNoteName'

export function PianoRoll() {
    return (
        <PianoRollDiv>
            {[...Array(consts.numNotes).keys()].reverse().map(i => (
                <Row style={rowStyle(i)} key={i} />
            ))}
        </PianoRollDiv>
    )

    function rowStyle(note: number): React.CSSProperties {
        return {
            width: compute.bodyWidth - consts.margin,
            backgroundColor: getNoteColour(note) === 'b' ? compute.theme.pianoRollBlack : compute.theme.pianoRollWhite,
        }
    }
}

const PianoRollDiv = styled.div`
    position: absolute;
    left: ${consts.margin}px;
`

const Row = styled.div`
    background-color: grey;
    height: ${consts.trayContentHeight / consts.numNotes}px;
    transition: ${consts.transition}ms;
`
