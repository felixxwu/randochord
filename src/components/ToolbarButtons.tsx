import { store } from '../utils/store'
import { Icon } from './Icon'
import undoIcon from '../images/undo.svg'
import redoIcon from '../images/redo.svg'
import theme from '../images/theme.svg'
import { downloadMidi } from '../helpers/midi'
import download from '../images/download.svg'
import clear from '../images/clear.svg'
import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import metronomeOn from '../images/metronomeOn.svg'
import metronomeOff from '../images/metronomeOff.svg'
import { getThemeVar } from '../utils/theme'

export function ToolbarButtons() {
    return (
        <>
            <Button onClick={store.undo} data-disabled={!store.canUndo()} title='Undo'>
                <Icon src={undoIcon} alt='undo' size='small' />
            </Button>
            <Button onClick={store.redo} data-disabled={!store.canRedo()} title='Redo'>
                <Icon src={redoIcon} alt='redo' size='small' />
            </Button>
            <Button onClick={toggleMetronome} title='Metronome on/off'>
                <Icon src={store.state.metronome ? metronomeOn : metronomeOff} alt='theme' size='small' />
            </Button>
            <Button onClick={changeTheme} title='Light/dark mode'>
                <Icon src={theme} alt='theme' size='small' />
            </Button>
            <Button onClick={downloadMidi} data-disabled={store.state.chords.length === 0} title='Export to MIDI'>
                <Icon src={download} alt='download' size='small' />
            </Button>
            <Button onClick={clearChords} data-disabled={store.state.chords.length === 0} title='Clear sequence'>
                <Icon src={clear} alt='clear' size='small' />
            </Button>
        </>
    )

    function changeTheme() {
        store.state.darkMode = !store.state.darkMode
    }

    function toggleMetronome() {
        store.state.metronome = !store.state.metronome
    }

    function clearChords() {
        store.state.chords = []
        store.saveHistory()
    }
}

const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: ${consts.smallButtonHeight}px;
    cursor: pointer;
    transition: ${consts.shortTransition}ms;

    &:hover {
        background-color: ${getThemeVar('highlight')};
    }

    img {
        width: ${consts.iconSmall}px;
    }

    &[data-disabled='true'] {
        opacity: 0.5;
        pointer-events: none;
    }
`
