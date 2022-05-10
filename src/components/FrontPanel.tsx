import { Button } from './Button'
import play from '../images/play.svg'
import stop from '../images/stop.svg'
import React from 'react'
import consts from '../utils/consts'
import styled from 'styled-components'
import { Knob } from './Knob'
import { store } from '../utils/store'

export function FrontPanel() {
    return (
        <FrontPanelDiv style={frontPanelStyle()}>
            <Button icon={play} small={false} />
            <Button icon={stop} small={false} />
            <MasterVolume>
                <Knob
                    text={`Vol. ${Math.round(store.state.masterVolume)}`}
                    value={store.state.masterVolume}
                    onTurn={value => (store.state.masterVolume = value)}
                />
            </MasterVolume>
        </FrontPanelDiv>
    )

    function frontPanelStyle(): React.CSSProperties {
        return {}
    }
}

const FrontPanelDiv = styled.div`
    display: flex;
    height: ${consts.panelHeight}px;
    align-items: center;
    padding: 0 20px;
    border-radius: ${consts.borderRadius}px;
    background-color: #fbfbfb;
    box-shadow: 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};

    > * + * {
        margin-left: ${consts.margin}px;
    }
`

const MasterVolume = styled.div`
    margin-left: auto;
`
