import styled from 'styled-components'
import React, { useEffect, Suspense } from 'react'
import { compute, onStoreUpdate, store } from './utils/store'
import consts from './utils/consts'
import { handleKeydown, handleKeyup } from './helpers/keypress'
import { Spinner } from './components/Spinner'

const Body = React.lazy(() => import('./viewsDesktop/Body'))
const MobileBody = React.lazy(() => import('./viewsMobile/MobileBody'))

export default function App() {
    store.subscribeToAll()
    onStoreUpdate()

    useEffect(() => {
        window.addEventListener('resize', () => {
            store.state.appWidth = window.innerWidth
            store.state.appHeight = window.innerHeight
        })
        window.addEventListener('keydown', handleKeydown)
        window.addEventListener('keyup', handleKeyup)
    }, [])

    return (
        <AppDiv style={style()}>
            {store.state.appWidth > consts.maxPanelWidth ? (
                <Suspense fallback={<Spinner transparent={false} />}>
                    <Body />
                </Suspense>
            ) : (
                <Suspense fallback={<Spinner transparent={true} />}>
                    <MobileBody />
                </Suspense>
            )}
        </AppDiv>
    )

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
