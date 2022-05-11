import { Button } from './Button'
import play from '../images/play.svg'
import stop from '../images/stop.svg'
import React, { useState } from 'react'
import consts from '../utils/consts'
import styled from 'styled-components'
import { Knob } from './Knob'
import { store } from '../utils/store'

export function FrontPanel() {
    const [tempVal, setTempVal] = useState(0)
    return (
        <FrontPanelDiv style={frontPanelStyle()}>
            <Button icon={play} small={false} />
            <Button icon={stop} small={false} />
            <Knob
                text={`${tempVal}`}
                divisions={10}
                scrollStep={1}
                value={tempVal}
                onTurn={value => setTempVal(value)}
            />
            <MasterVolume>
                <Knob
                    text={`Vol. ${store.state.masterVolume}`}
                    divisions={100}
                    scrollStep={5}
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
