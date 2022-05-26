import React from 'react'
import './Spinner.css'
import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'

export function Spinner(props: { transparent: boolean }) {
    return (
        <Wrapper style={style()}>
            {props.transparent && 'Loading...'}
            <div className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
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

    > * div {
        background: var(--textColour);
    }
`
