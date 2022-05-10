import { Body } from './Body'
import styled from 'styled-components'
import React from 'react'
import { store } from '../utils/store'

export default function App() {
    store.subscribeToAll()

    return (
        <AppDiv style={style()}>
            <Body></Body>
        </AppDiv>
    )

    function style(): React.CSSProperties {
        return {}
    }
}

const AppDiv = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ededed;
`
