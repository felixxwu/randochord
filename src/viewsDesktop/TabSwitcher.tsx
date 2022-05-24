import styled from 'styled-components'
import consts from '../utils/consts'
import React from 'react'
import { Tab } from '../components/Tab'
import { MidiTab } from '../components/MidiTab'
import { SynthTab } from '../components/SynthTab'
import { AlgorithmTab } from '../components/AlgorithmTab'
import { TabType } from '../utils/types'
import { store } from '../utils/store'

export function TabSwitcher() {
    return (
        <TabSwitcherDiv>
            <Tabs>
                <Tab type='midi' />
                <Tab type='synth' />
                <Tab type='algorithm' />
            </Tabs>
            <TabContent style={tabContentStyle('midi')}>
                <MidiTab />
            </TabContent>
            <TabContent style={tabContentStyle('synth')}>
                <SynthTab />
            </TabContent>
            <TabContent style={tabContentStyle('algorithm')}>
                <AlgorithmTab />
            </TabContent>
        </TabSwitcherDiv>
    )

    function tabContentStyle(type: TabType): React.CSSProperties {
        const unitSpaces = Math.max(consts.minBodyWidth, Math.min(store.state.chords.length + 1, consts.maxBodyWidth))
        const width = unitSpaces * (consts.buttonWidth + consts.margin) + consts.margin
        const order: { [key in TabType]: number } = { midi: 0, synth: 1, algorithm: 2 }
        const offset: { [key in TabType]: number } = {
            midi: order.midi - order[store.state.currentTab],
            synth: order.synth - order[store.state.currentTab],
            algorithm: order.algorithm - order[store.state.currentTab],
        }
        return { left: `${width * offset[type]}px` }
    }
}

const TabSwitcherDiv = styled.div`
    height: 100%;
`

const Tabs = styled.div`
    display: flex;
    padding: ${consts.margin}px;
    justify-content: center;
    gap: ${consts.margin}px;
`

const TabContent = styled.div`
    width: 100%;
    top: ${consts.tabHeight + 2 * consts.margin}px;
    height: calc(100% - ${consts.tabHeight + 2 * consts.margin}px);
    position: absolute;
    transition: ${consts.transition}ms cubic-bezier(0.7, 0, 0.3, 1);
`
