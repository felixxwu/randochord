import styled from 'styled-components'
import consts from '../utils/consts'
import { getTrayPosition, store } from '../utils/store'
import React from 'react'
import chevron from '../images/chevron.svg'
import { Icon } from './Icon'

export function TrayContent() {
    return (
        <Tray style={style()}>
            <TrayContentWrapper>
                <TrayContentDiv>
                    hello
                    <br />
                    hello
                    <br />
                    hello
                    <br />
                    hello
                </TrayContentDiv>
            </TrayContentWrapper>
            <OpenCloseHandle onClick={handleHandleClick}>
                <Chevron style={chevronStyle()}>
                    <Icon src={chevron} alt='open/close' size='small' />
                </Chevron>
            </OpenCloseHandle>
        </Tray>
    )

    function handleHandleClick() {
        store.state.trayOpen = !store.state.trayOpen
        store.state.masterVolume = 50
    }

    function style(): React.CSSProperties {
        return {
            height: `${getTrayPosition()}px`,
        }
    }

    function chevronStyle(): React.CSSProperties {
        return {
            transform: store.state.trayOpen ? 'rotate(180deg)' : '',
        }
    }
}

const Tray = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: ${consts.transition}ms;
    overflow: hidden;
`

const TrayContentWrapper = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
`

const TrayContentDiv = styled.div`
    position: absolute;
    bottom: 0;
`

const OpenCloseHandle = styled.div`
    height: ${consts.trayPositions[0]}px;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    cursor: pointer;
    transition: ${consts.transition}ms;
    opacity: 0.5;
    &:hover {
        opacity: 1;
    }
`

const Chevron = styled.div`
    transition: ${consts.transition}ms;
`
