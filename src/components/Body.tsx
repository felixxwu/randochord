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
        const unitSpaces = Math.max(
            consts.minBodyWidth,
            Math.min(store.state.chords.length + 1, consts.maxBodyWidth)
        )
        return {
            width: `${unitSpaces * (consts.buttonWidth + consts.margin) + consts.margin}px`,
            height: `${consts.panelHeight + store.state.getTrayPosition()}px`,
        }
    }
}

const Tray = styled.div`
    border-radius: ${consts.borderRadius}px;
    box-shadow: 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};
    overflow: hidden;
    background-color: #fff0f0;
    transition: ${consts.transition}ms;
`
