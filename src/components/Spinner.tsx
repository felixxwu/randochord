import React from 'react'
import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'

export function Spinner(props: { transparent: boolean }) {
    return (
        <Wrapper style={style()}>
            {props.transparent && 'Loading...'}
            <SpinnerDiv className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </SpinnerDiv>
        </Wrapper>
    )

    function style(): React.CSSProperties {
        if (props.transparent) return {}
        return {
            boxShadow: `0 0 ${consts.shadowBlur}px 0 ${compute.theme.shadowColour}`,
            backgroundColor: compute.theme.trayColour,
        }
    }
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${consts.margin}px;
    align-items: center;
    justify-content: center;
    width: ${consts.spinnerWidth}px;
    height: ${consts.spinnerWidth}px;
    border-radius: ${consts.spinnerWidth}px;
`

const SpinnerDiv = styled.div`
    display: inline-block;
    position: relative;
    width: 70px;
    height: 10px;
    transform: scale(0.5);

    > div {
        background: var(--textColour);
        position: absolute;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    > div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
    }

    > div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    > div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    > div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
    }

    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }

    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(24px, 0);
        }
    }
`
