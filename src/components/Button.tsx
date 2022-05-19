import styled from 'styled-components'
import React from 'react'
import consts from '../utils/consts'

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
        }
    }
}

const ButtonDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${consts.buttonWidth}px;
    border-radius: ${consts.borderRadius}px;
    box-shadow: inset 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};
    cursor: pointer;
    transition: ${consts.shortTransition}ms;
    overflow: hidden;
    background-color: #e6f8ff;

    &:hover {
        background-color: #ffe6e6;
    }
`
