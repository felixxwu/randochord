import styled from 'styled-components'
import consts from '../utils/consts'
import undoIcon from '../images/undo.svg'
import redoIcon from '../images/redo.svg'
import clear from '../images/clear.svg'
import theme from '../images/theme.svg'
import download from '../images/download.svg'
import { Icon } from './Icon'
import { store } from '../utils/store'
import React from 'react'
import { canRedo, canUndo, redo, saveHistory, undo } from '../utils/undo'
import { downloadMidi } from '../helpers/midi'

export function Toolbar() {
    return (
        <ToolbarDiv style={style()}>
            <Title>RandoChord</Title>
            <Button onClick={undo} data-disabled={!canUndo()}>
                <Icon src={undoIcon} alt='undo' size='small' />
            </Button>
            <Button onClick={redo} data-disabled={!canRedo()}>
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
            backgroundColor: store.state.theme.toolbarColour,
        }
    }

    function changeTheme() {
        const isLight = JSON.stringify(store.state.theme) === JSON.stringify(consts.lightTheme)
        if (isLight) {
            store.state.theme = consts.darkTheme
        } else {
            store.state.theme = consts.lightTheme
        }
    }

    function clearChords() {
        store.state.chords = []
        saveHistory()
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
