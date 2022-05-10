import styled from 'styled-components'
import consts from '../utils/consts'
import { store } from '../utils/store'
import React from 'react'
import chevron from '../images/chevron.svg'

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
                <Chevron
                    style={chevronStyle()}
                    src={chevron}
                    alt='open/close'
                    width={consts.iconSmall}
                />
            </OpenCloseHandle>
        </Tray>
    )

    function handleHandleClick() {
        store.state.trayOpen = !store.state.trayOpen
    }

    function style(): React.CSSProperties {
        return {
            height: `${store.state.getTrayPosition()}px`,
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

const Chevron = styled.img`
    transition: ${consts.transition}ms;
`
