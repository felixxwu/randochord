import styled from 'styled-components'
import React from 'react'
import consts from '../utils/consts'

export function Button(props: {
    text?: string
    icon?: string
    onDrag?: (amount: number) => void
    small: boolean
}) {
    const content = props.icon ? (
        <img src={props.icon} alt='icon' draggable={false} width={consts.iconLarge} />
    ) : (
        props.text
    )

    return <ButtonDiv style={style()}>{content}</ButtonDiv>

    function style(): React.CSSProperties {
        return {}
    }
}

const ButtonDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background-color: #e6f8ff;
    border-radius: ${consts.borderRadius}px;
    box-shadow: inset 0 0 ${consts.shadowBlur}px 0 ${consts.shadowColor};
    cursor: pointer;
`
