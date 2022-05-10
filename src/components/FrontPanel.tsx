import { Button } from './Button'
import play from '../images/play.svg'
import stop from '../images/stop.svg'
import React from 'react'
import consts from '../utils/consts'
import styled from 'styled-components'

export function FrontPanel() {
    return (
        <FrontPanelDiv style={frontPanelStyle()}>
            <Button icon={play} />
            <Button icon={stop} />
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
