import styled from 'styled-components'
import { PlayStopButton } from '../components/PlayStopButton'
import React, { useEffect, useState } from 'react'
import { store } from '../utils/store'
import consts from '../utils/consts'
import { Knob } from '../components/Knob'
import { ChordButton } from '../components/ChordButton'
import { AddChord } from '../components/AddChord'
import { MobileToolbar } from './MobileToolbar'

export function MobileBody() {
    const [isBlank, setIsBlank] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsBlank(false)
        })
    }, [])

    return (
        <MobileBodyDiv style={style()}>
            <MobileToolbar />
            <TopRow>
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
            </TopRow>
            <ChordGrid>
                {store.state.chords.map((chord, index) => (
                    <ChordButton key={index} chord={chord} index={index} />
                ))}
                <AddChord />
            </ChordGrid>
        </MobileBodyDiv>
    )

    function style(): React.CSSProperties {
        return {
            height: store.state.appHeight,
            opacity: isBlank ? 0 : 1,
            transform: `translateY(${isBlank ? 200 : 0}px)`,
        }
    }
}

const MobileBodyDiv = styled.div`
    width: 100vw;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${consts.margin}px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: ${2 * consts.transition}ms cubic-bezier(0.22, 0.61, 0.36, 1);
`

const BPMKnob = styled.div`
    width: ${consts.buttonWidth}px;
`

const TopRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${consts.margin}px;
    margin-bottom: ${consts.margin};
`

const ChordGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${consts.margin}px;
    margin-left: ${consts.margin}px;
    margin-right: ${consts.margin}px;
    margin-bottom: ${consts.margin}px;
`
