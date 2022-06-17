import consts from '../utils/consts'
import React from 'react'
import { chordAttack, chordRelease } from '../helpers/playChords'
import styled from 'styled-components'
import { compute } from '../utils/store'
import { getNoteColour } from '../helpers/getNoteName'
import { getThemeVar } from '../utils/theme'

export function Keyboard() {
    return (
        <KeyBoard>
            {[...Array(consts.numNotes).keys()].reverse().map(i => (
                <KeyBoardNote
                    style={keyStyle(i)}
                    key={i}
                    onPointerDown={() => handlePlayNote(i)}
                    onPointerEnter={e => handlePlayNote(i, e)}
                    onPointerUp={() => handleStopNote(i)}
                    onPointerCancel={() => handleStopNote(i)}
                    onPointerLeave={() => handleStopNote(i)}
                    onPointerOut={() => handleStopNote(i)}
                />
            ))}
        </KeyBoard>
    )

    function handlePlayNote(note: number, event?: React.PointerEvent) {
        if (event && event.buttons <= 0) return
        chordAttack([note + consts.lowestNote])
    }

    function handleStopNote(note: number) {
        chordRelease([note + consts.lowestNote])
    }

    function keyStyle(note: number): React.CSSProperties {
        return {
            backgroundColor: getNoteColour(note) === 'b' ? compute.theme.blackKey : compute.theme.whiteKey,
        }
    }
}

const outlineWidth = 2

const KeyBoard = styled.div`
    outline: ${outlineWidth}px solid ${getThemeVar('keyboardOutline')};
    outline-offset: -${outlineWidth}px;
    margin-left: -${outlineWidth}px;
    width: ${consts.margin + outlineWidth}px;
    height: 100%;
    transition: ${consts.transition}ms;
    border-radius: ${consts.midiNoteBorderRadius}px;
`

const KeyBoardNote = styled.div`
    height: ${consts.trayContentHeight / consts.numNotes}px;
    cursor: pointer;

    &:hover {
        border-left: 5px ${consts.darkTheme.buttonColour} solid;
    }
`
