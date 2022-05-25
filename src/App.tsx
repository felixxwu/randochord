import { Body } from './viewsDesktop/Body'
import styled from 'styled-components'
import React, { useEffect } from 'react'
import { compute, onStoreUpdate, store } from './utils/store'
import consts from './utils/consts'
import { MobileBody } from './viewsMobile/MobileBody'

export default function App() {
    store.subscribeToAll()
    onStoreUpdate()

    useEffect(() => {
        window.addEventListener('resize', () => {
            store.state.appWidth = window.innerWidth
            store.state.appHeight = window.innerHeight
        })
    }, [])

    return <AppDiv style={style()}>{store.state.appWidth > consts.maxPanelWidth ? <Body /> : <MobileBody />}</AppDiv>

    function style(): React.CSSProperties {
        return {
            color: compute.theme.textColour,
            backgroundColor:
                store.state.appWidth > consts.maxPanelWidth ? compute.theme.bgColour : compute.theme.frontPanelColour,
            height: `${store.state.appHeight}px`,
        }
    }
}

const AppDiv = styled.div`
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ${consts.transition}ms;
    overflow: hidden;
`
