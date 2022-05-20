import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import consts from '../utils/consts'
import { getTheme, getTrayPosition, store } from '../utils/store'
import { FrontPanel } from './FrontPanel'
import { TrayContent } from './TrayContent'

export function Body() {
    const [isSmall, setIsSmall] = useState(true)
    const [isBlank, setIsBlank] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsSmall(false)
            setTimeout(() => {
                setIsBlank(false)
            }, consts.transition)
        })
    }, [])

    return (
        <Tray style={trayStyle()}>
            <div style={frontPanelStyle()}>
                <FrontPanel />
            </div>
            <TrayContent />
        </Tray>
    )

    function trayStyle(): React.CSSProperties {
        const unitSpaces = Math.max(consts.minBodyWidth, Math.min(store.state.chords.length + 1, consts.maxBodyWidth))
        const fullWidth = unitSpaces * (consts.buttonWidth + consts.margin) + consts.margin
        const fullHeight = isBlank ? consts.panelHeight : consts.panelHeight + getTrayPosition()
        return {
            width: `${isSmall ? 50 : fullWidth}px`,
            height: `${isSmall ? 50 : fullHeight}px`,
            backgroundColor: getTheme().trayColour,
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${getTheme().shadowColour}`,
            borderRadius: `${isSmall ? 100 : consts.borderRadius}px`,
            border: `solid ${isSmall ? getTheme().knobLineColour : 'transparent'} ${isSmall ? 2 : 0}px`,
        }
    }

    function frontPanelStyle(): React.CSSProperties {
        return {
            opacity: isBlank ? 0 : 1,
            transition: `${consts.transition}ms`,
        }
    }
}

const Tray = styled.div`
    overflow: hidden;
    transition: ${consts.transition}ms;
`
