import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import consts from '../utils/consts'
import { compute, store } from '../utils/store'
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
        const fullHeight = isBlank ? consts.panelHeight : consts.panelHeight + compute.trayPosition
        return {
            width: `${isSmall ? 50 : compute.bodyWidth}px`,
            height: `${isSmall ? 50 : fullHeight}px`,
            backgroundColor: compute.theme.trayColour,
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${compute.theme.shadowColour}`,
            borderRadius: `${isSmall ? 100 : consts.borderRadius}px`,
            border: `solid ${isSmall ? compute.theme.knobLineColour : 'transparent'} ${isSmall ? 2 : 0}px`,
            maxHeight: store.state.appHeight,
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
    overflow-x: hidden;
    overflow-y: auto;
    transition: ${consts.transition}ms;
`
