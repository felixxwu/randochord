import styled from 'styled-components'
import consts from '../utils/consts'
import { TabType } from '../utils/types'
import React from 'react'
import { getTheme, store } from '../utils/store'

export function Tab(props: { type: TabType }) {
    return (
        <TabDiv style={style()} onClick={handleClick}>
            {getText()}
        </TabDiv>
    )

    function handleClick() {
        store.state.currentTab = props.type
    }

    function getText() {
        if (props.type === 'midi') return 'MIDI'
        if (props.type === 'synth') return 'Synth'
        if (props.type === 'algorithm') return 'Algorithm'
    }

    function style(): React.CSSProperties {
        return {
            outline: `${consts.tabBorderWidth}px solid ${
                store.state.currentTab === props.type ? getTheme().textColour : 'transparent'
            }`,
        }
    }
}

const TabDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${consts.borderRadius}px;
    width: 130px;
    height: ${consts.tabHeight}px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 3px;
    cursor: pointer;
    background-color: var(--frontPanelColour);
    transition: ${consts.shortTransition}ms;
    outline-offset: -${consts.tabBorderWidth}px;

    &:hover {
        background-color: var(--highlight);
    }
`
