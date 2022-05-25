import styled from 'styled-components'
import consts from '../utils/consts'
import { compute } from '../utils/store'
import React from 'react'
import { ToolbarButtons } from '../components/ToolbarButtons'

export function Toolbar() {
    return (
        <ToolbarDiv style={style()}>
            <Title>RandoChord</Title>
            <ToolbarButtons />
        </ToolbarDiv>
    )

    function style(): React.CSSProperties {
        return {
            backgroundColor: compute.theme.toolbarColour,
        }
    }
}

const ToolbarDiv = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${consts.margin}px;
    margin-left: -${consts.margin}px;
    width: 100%;
    min-height: ${consts.smallButtonHeight}px;
    max-height: ${consts.smallButtonHeight}px;
    transition: ${consts.transition}ms;
`

const Title = styled.div`
    flex: 1;
    text-transform: uppercase;
    letter-spacing: ${consts.titleSpacing}px;
`
