import styled from 'styled-components'
import { PlayStopButton } from '../components/PlayStopButton'
import React, { useEffect, useState } from 'react'
import { store } from '../utils/store'
import consts from '../utils/consts'
import { Knob } from '../components/Knob'
import { ChordButton } from '../components/ChordButton'
import { AddChord } from '../components/AddChord'
import { MobileToolbar } from './MobileToolbar'
import { Tab } from '../components/Tab'
import { TabType } from '../utils/types'
import { SynthTab } from '../components/SynthTab'
import { AlgorithmTab } from '../components/AlgorithmTab'

export function MobileBody() {
    const [isBlank, setIsBlank] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsBlank(false)
            // midi tab not valid on mobile
            if (store.state.currentTab === 'midi') store.state.currentTab = 'chords'
        })
    }, [])

    return (
        <MobileBodyDiv style={style()}>
            <MobileToolbar />
            <Tabs>
                <Tab type={'chords'} />
                <Tab type={'synth'} />
                <Tab type={'algorithm'} />
            </Tabs>
            <RelativeWrapper>
                <TabContent style={tabContentStyle('chords')}>
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
                </TabContent>
                <TabContent style={tabContentStyle('synth')}>
                    <SynthTab />
                </TabContent>
                <TabContent style={tabContentStyle('algorithm')}>
                    <AlgorithmTab />
                </TabContent>
            </RelativeWrapper>
        </MobileBodyDiv>
    )

    function style(): React.CSSProperties {
        return {
            height: store.state.appHeight,
            opacity: isBlank ? 0 : 1,
            transform: `translateY(${isBlank ? 200 : 0}px)`,
        }
    }

    function tabContentStyle(type: TabType): React.CSSProperties {
        const order: { [key in TabType]: number } = { midi: 0, synth: 1, algorithm: 2, chords: 0 }
        const offset: { [key in TabType]: number } = {
            midi: 0,
            synth: order.synth - order[store.state.currentTab],
            algorithm: order.algorithm - order[store.state.currentTab],
            chords: order.chords - order[store.state.currentTab],
        }
        return { left: `${store.state.appWidth * offset[type]}px`, opacity: store.state.currentTab === type ? 1 : 0 }
    }
}

const MobileBodyDiv = styled.div`
    width: 100vw;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

const Tabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: ${consts.margin}px;
    justify-content: center;
    gap: ${consts.margin}px;

    > * {
        background-color: var(--highlight);
    }
`

const TabContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${consts.margin}px;
    position: absolute;
    transition: ${consts.transition}ms cubic-bezier(0.5, 0, 0.5, 1);
    width: 100%;

    > * select {
        background-color: var(--toolbarColour);
    }
`

const RelativeWrapper = styled.div`
    position: relative;
    width: 100%;
`
