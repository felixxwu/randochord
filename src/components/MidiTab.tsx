import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'
import React from 'react'
import { getNoteColour } from '../helpers/getNoteName'

export function MidiTab() {
    return (
        <MidiTabDiv>
            <KeyBoard>
                {[...Array(consts.numNotes).keys()].reverse().map(i => (
                    <KeyBoardNote style={keyStyle(i)} key={i} />
                ))}
            </KeyBoard>
        </MidiTabDiv>
    )

    function keyStyle(note: number): React.CSSProperties {
        return {
            backgroundColor: getNoteColour(note) === 'b' ? compute.theme.textColour : compute.theme.frontPanelColour,
        }
    }
}

const MidiTabDiv = styled.div`
    display: flex;
    height: 100%;
`

const KeyBoard = styled.div`
    outline: 2px solid var(--textColour);
    width: ${consts.margin}px;
    height: 100%;
`

const KeyBoardNote = styled.div`
    height: ${compute.trayContentHeight / consts.numNotes}px;
    background-color: #fff;
`
