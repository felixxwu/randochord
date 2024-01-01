import styled from 'styled-components'
import consts from '../utils/consts'
import React from 'react'
import { compute, store } from '../utils/store'
import { ToolbarButtons } from '../components/ToolbarButtons'

export function MobileToolbar() {
  return (
    <MobileToolbarDiv style={style()}>
      <Title>RandoChord</Title>

      <Buttons>
        <ToolbarButtons />
      </Buttons>
    </MobileToolbarDiv>
  )

  function style(): React.CSSProperties {
    return {
      backgroundColor: compute.theme.toolbarColour,
      width: getToolbarWidth(),
    }
  }

  function getToolbarWidth() {
    const cutoff = 4 * consts.buttonWidth + 5 * consts.margin
    const fourWide = 4 * consts.buttonWidth + 3 * consts.margin
    const threeWide = 3 * consts.buttonWidth + 2 * consts.margin
    return store.state.appWidth > cutoff ? fourWide : threeWide
  }
}

const MobileToolbarDiv = styled.div`
  text-align: center;
  background-color: grey;
  padding: ${consts.margin}px;
  margin-top: ${consts.margin}px;
  max-width: calc(100vw - 2 * ${consts.margin}px);
  box-sizing: border-box;
  border-radius: ${consts.borderRadius}px;
`

const Buttons = styled.div`
  padding-top: ${consts.margin}px;
  display: flex;
  justify-content: center;

  > * {
    &:hover {
      background-color: transparent;
    }
  }
`

const Title = styled.div`
  text-transform: uppercase;
  letter-spacing: ${consts.titleSpacing}px;
`
