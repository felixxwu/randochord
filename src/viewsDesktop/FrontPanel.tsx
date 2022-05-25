import React from 'react'
import consts from '../utils/consts'
import styled from 'styled-components'
import { Knob } from '../components/Knob'
import { compute, store } from '../utils/store'
import { ChordButton } from '../components/ChordButton'
import { AddChord } from '../components/AddChord'
import { PlayStopButton } from '../components/PlayStopButton'
import { Toolbar } from './Toolbar'

export function FrontPanel() {
    return (
        <FrontPanelDiv style={frontPanelStyle()}>
            <Toolbar />
            <ControlRow>
                <PlayStopButton />
                <BPMKnob>
                    <Knob
                        text={`BPM ${store.state.bpm}`}
                        divisions={consts.maxBpm - consts.minBpm}
                        scrollStep={1}
                        value={store.state.bpm - consts.minBpm}
                        onTurn={value => (store.state.bpm = value + consts.minBpm)}
                        title='Beats per minute'
                    />
                </BPMKnob>
                <VolKnob>
                    <Knob
                        text={`Vol. ${store.state.masterVolume}`}
                        divisions={100}
                        scrollStep={5}
                        value={store.state.masterVolume}
                        onTurn={value => (store.state.masterVolume = value)}
                        title='Master volume'
                    />
                </VolKnob>
            </ControlRow>
            <ChordRow>
                {store.state.chords.map((chord, index) => (
                    <ChordButton key={index} chord={chord} index={index} />
                ))}
                <AddChord />
            </ChordRow>
        </FrontPanelDiv>
    )

    function frontPanelStyle(): React.CSSProperties {
        return {
            backgroundColor: compute.theme.frontPanelColour,
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${compute.theme.shadowColour}`,
        }
    }
}

const FrontPanelDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: ${consts.panelHeight}px;
    padding: ${consts.margin}px;
    box-sizing: border-box;
    border-radius: ${consts.borderRadius}px;
    transition: ${consts.transition}ms;

    > * + * {
        margin-top: ${consts.margin}px;
    }
`

const ControlRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;

    > * + * {
        margin-left: ${consts.margin}px;
    }
`

const ChordRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;

    > * + * {
        margin-left: ${consts.margin}px;
    }
`

const BPMKnob = styled.div`
    margin-left: auto;
    width: ${consts.buttonWidth}px;
`

const VolKnob = styled.div`
    width: ${consts.buttonWidth}px;
`
