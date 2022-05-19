import React from 'react'
import consts from '../utils/consts'
import styled from 'styled-components'
import { Knob } from './Knob'
import { store } from '../utils/store'
import { ChordButton } from './ChordButton'
import { AddChord } from './AddChord'
import { PlayStopButton } from './PlayStopButton'

export function FrontPanel() {
    return (
        <FrontPanelDiv style={frontPanelStyle()}>
            <ControlRow>
                <PlayStopButton />
                <BPMKnob>
                    <Knob
                        text={`BPM ${store.state.bpm}`}
                        divisions={consts.maxBpm - consts.minBpm}
                        scrollStep={1}
                        value={store.state.bpm - consts.minBpm}
                        onTurn={value => (store.state.bpm = value + consts.minBpm)}
                    />
                </BPMKnob>
                <Knob
                    text={`Vol. ${store.state.masterVolume}`}
                    divisions={100}
                    scrollStep={5}
                    value={store.state.masterVolume}
                    onTurn={value => (store.state.masterVolume = value)}
                />
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
        return {}
    }
}

const FrontPanelDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: ${consts.panelHeight}px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: ${consts.borderRadius}px;
    background-color: #fbfbfb;
    box-shadow: 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};

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
`
