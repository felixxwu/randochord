import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import consts from '../utils/consts'
import { compute, store } from '../utils/store'
import { FrontPanel } from './FrontPanel'
import { TrayContent } from './TrayContent'

export default function Body() {
    const [isSmall, setIsSmall] = useState(true)
    const [isBlank, setIsBlank] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsSmall(false)
            setTimeout(() => {
                setIsBlank(false)
                // chords tab not valid on desktop
                if (store.state.currentTab === 'chords') store.state.currentTab = 'midi'
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
            width: `${isSmall ? consts.spinnerWidth : compute.bodyWidth}px`,
            height: `${isSmall ? consts.spinnerWidth : fullHeight}px`,
            backgroundColor: compute.theme.trayColour,
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${compute.theme.shadowColour}`,
            borderRadius: `${isSmall ? consts.spinnerWidth : consts.borderRadius}px`,
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

    //hide scrollbars
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none;
    }
`
