import styled from 'styled-components'
import consts from '../utils/consts'
import React from 'react'
import { getTheme, store } from '../utils/store'
import { Icon } from '../components/Icon'
import undoIcon from '../images/undo.svg'
import redoIcon from '../images/redo.svg'
import theme from '../images/theme.svg'
import { downloadMidi } from '../helpers/midi'
import download from '../images/download.svg'
import clear from '../images/clear.svg'

export function MobileToolbar() {
    return (
        <MobileToolbarDiv style={style()}>
            <Title>RandoChord</Title>

            <Buttons>
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
            </Buttons>
        </MobileToolbarDiv>
    )

    function style(): React.CSSProperties {
        return {
            backgroundColor: getTheme().toolbarColour,
            width: getToolbarWidth(),
        }
    }

    function changeTheme() {
        store.state.darkMode = !store.state.darkMode
    }

    function clearChords() {
        store.state.chords = []
        store.saveHistory()
    }

    function getToolbarWidth() {
        const cutoff = 4 * consts.buttonWidth + 5 * consts.margin
        const fourWide = 4 * consts.buttonWidth + 3 * consts.margin
        const threeWide = 3 * consts.buttonWidth + 2 * consts.margin
        return store.state.appWidth > cutoff ? fourWide : threeWide
    }
}

const MobileToolbarDiv = styled.div`
    text-align: center;
    background-color: grey;
    padding: ${consts.margin}px;
    margin-top: ${consts.margin}px;
    max-width: calc(100vw - 2 * ${consts.margin}px);
    box-sizing: border-box;
    border-radius: ${consts.borderRadius}px;
`

const Buttons = styled.div`
    padding-top: ${consts.margin}px;
    display: flex;
    justify-content: center;
`

const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: ${consts.smallButtonHeight}px;
    cursor: pointer;

    img {
        width: ${consts.iconSmall}px;
    }

    &[data-disabled='true'] {
        opacity: 0.5;
        pointer-events: none;
    }
`

const Title = styled.div`
    text-transform: uppercase;
    letter-spacing: ${consts.titleSpacing}px;
`
