import { Body } from './viewsDesktop/Body'
import styled from 'styled-components'
import React from 'react'
import { getTheme, onStoreUpdate, store } from './utils/store'
import consts from './utils/consts'

export default function App() {
    store.subscribeToAll()
    onStoreUpdate()

    return (
        <AppDiv style={style()}>
            <Body></Body>
        </AppDiv>
    )

    function style(): React.CSSProperties {
        return {
            color: getTheme().textColour,
            backgroundColor: getTheme().bgColour,
        }
    }
}

const AppDiv = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: ${consts.transition}ms;
    touch-action: none;
`
