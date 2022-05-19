import styled from 'styled-components'
import React from 'react'
import consts from '../utils/consts'
import { store } from '../utils/store'

export function Button(props: {
    text?: string
    icon?: string
    onDrag?: (amount: number) => void
    onClick?: () => void
    small: boolean
    onPointerDown?: () => void
    onPointerUp?: () => void
    highlighted?: boolean
}) {
    const content = props.icon ? (
        <img
            src={props.icon}
            alt='icon'
            draggable={false}
            width={props.small ? consts.iconSmall : consts.iconLarge}
            style={{ filter: `invert(1) brightness(${consts.lightTheme.textLightness / 100})` }}
        />
    ) : (
        props.text
    )

    return (
        <ButtonDiv
            onClick={props.onClick}
            style={style()}
            onPointerDown={props.onPointerDown}
            onPointerUp={props.onPointerUp}
            onPointerCancel={props.onPointerUp}
            onPointerLeave={props.onPointerUp}
            onPointerOut={props.onPointerUp}
        >
            {content}
        </ButtonDiv>
    )

    function style(): React.CSSProperties {
        return {
            backgroundColor: props.highlighted ? '#e6fff9' : undefined,
            height: `${props.small ? consts.smallButtonHeight : consts.buttonHeight}px`,
            boxShadow: `inset 0 0 20px 0 ${store.state.theme.shadowColour}`,
        }
    }
}

const ButtonDiv = styled.div`
    color: ${consts.lightTheme.textColour};
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${consts.buttonWidth}px;
    border-radius: ${consts.borderRadius}px;
    cursor: pointer;
    transition: ${consts.shortTransition}ms;
    overflow: hidden;
    background-color: var(--buttonColour);

    &:hover {
        background-color: #ffe6e6;
    }
`
