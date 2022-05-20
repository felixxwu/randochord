import { Body } from './Body'
import styled from 'styled-components'
import React, { useEffect } from 'react'
import { getTheme, onStoreUpdate, store } from '../utils/store'
import consts from '../utils/consts'
import { initHistory } from '../utils/undo'

export default function App() {
    store.subscribeToAll()
    onStoreUpdate()

    useEffect(() => {
        initHistory()
    }, [])

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
`
