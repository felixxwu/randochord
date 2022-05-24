import styled from 'styled-components'
import consts from '../utils/consts'
import undoIcon from '../images/undo.svg'
import redoIcon from '../images/redo.svg'
import clear from '../images/clear.svg'
import theme from '../images/theme.svg'
import download from '../images/download.svg'
import { Icon } from '../components/Icon'
import { getTheme, store } from '../utils/store'
import React from 'react'
import { downloadMidi } from '../helpers/midi'

export function Toolbar() {
    return (
        <ToolbarDiv style={style()}>
            <Title>RandoChord</Title>
            <Button onClick={store.undo} data-disabled={!store.canUndo()}>
                <Icon src={undoIcon} alt='undo' size='small' />
            </Button>
            <Button onClick={store.redo} data-disabled={!store.canRedo()}>
                <Icon src={redoIcon} alt='redo' size='small' />
            </Button>
            <Button onClick={changeTheme}>
                <Icon src={theme} alt='theme' size='small' />
            </Button>
            <Button onClick={downloadMidi} data-disabled={store.state.chords.length === 0}>
                <Icon src={download} alt='download' size='small' />
            </Button>
            <Button onClick={clearChords} data-disabled={store.state.chords.length === 0}>
                <Icon src={clear} alt='clear' size='small' />
            </Button>
        </ToolbarDiv>
    )

    function style(): React.CSSProperties {
        return {
            backgroundColor: getTheme().toolbarColour,
        }
    }

    function changeTheme() {
        store.state.darkMode = !store.state.darkMode
    }

    function clearChords() {
        store.state.chords = []
        store.saveHistory()
    }
}

const ToolbarDiv = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${consts.margin}px;
    margin-left: -${consts.margin}px;
    width: 100%;
    min-height: ${consts.smallButtonHeight}px;
    max-height: ${consts.smallButtonHeight}px;
    transition: ${consts.transition}ms;
`

const Title = styled.div`
    flex: 1;
    text-transform: uppercase;
    letter-spacing: 10px;
`

const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: ${consts.smallButtonHeight}px;
    cursor: pointer;

    &:hover {
        background-color: var(--highlight);
    }

    img {
        width: ${consts.iconSmall}px;
    }

    &[data-disabled='true'] {
        opacity: 0.5;
        pointer-events: none;
    }
`
