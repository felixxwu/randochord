import styled from 'styled-components'
import consts from '../utils/consts'
import React from 'react'
import { Tab } from '../components/Tab'
import { MidiTab } from '../components/MidiTab'
import { SynthTab } from '../components/SynthTab'
import { AlgorithmTab } from '../components/AlgorithmTab'
import { TabType } from '../utils/types'
import { compute, store } from '../utils/store'

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
    const order: { [key in TabType]: number } = { midi: 0, synth: 1, algorithm: 2, chords: 0 }
    const offset: { [key in TabType]: number } = {
      midi: order.midi - order[store.state.currentTab],
      synth: order.synth - order[store.state.currentTab],
      algorithm: order.algorithm - order[store.state.currentTab],
      chords: 0,
    }
    return { left: `${compute.bodyWidth * offset[type]}px`, opacity: store.state.currentTab === type ? 1 : 0 }
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
  top: ${consts.tabSwitcherHeight}px;
  height: ${consts.trayContentHeight}px;
  position: absolute;
  transition: ${consts.transition}ms cubic-bezier(0.5, 0, 0.5, 1);
`
