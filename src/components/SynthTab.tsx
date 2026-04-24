import styled from 'styled-components'
import consts from '../utils/consts'
import { ReleaseKnob } from './Knobs/ReleaseKnob'
import { PolyphonyKnob } from './Knobs/PolyphonyKnob'
import { AttackKnob } from './Knobs/AttackKnob'
import { DecayKnob } from './Knobs/DecayKnob'
import { SustainKnob } from './Knobs/SustainKnob'

export function SynthTab() {
  return (
    <Div>
      <Row>
        <AttackKnob />
        <DecayKnob />
        <SustainKnob />
        <ReleaseKnob />
      </Row>
      <Row>
        <PolyphonyKnob />
      </Row>
    </Div>
  )
}

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${consts.margin}px;
`

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: ${consts.margin}px;
`
