import styled from 'styled-components'
import React from 'react'
import consts from '../utils/consts'
import { store } from '../utils/store'
import { FrontPanel } from './FrontPanel'
import { TrayContent } from './TrayContent'

export function Body() {
    return (
        <Tray style={trayStyle()}>
            <FrontPanel />
            <TrayContent />
        </Tray>
    )

    function trayStyle(): React.CSSProperties {
        return {
            height: `${consts.panelHeight + store.state.getTrayPosition()}px`,
        }
    }
}

const Tray = styled.div`
    border-radius: ${consts.borderRadius}px;
    box-shadow: 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};
    width: 600px;
    overflow: hidden;
    background-color: ${consts.trayColour};
    transition: ${consts.transition}ms;
`
