import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50
const MIN_VALUE = 0.001
const MAX_VALUE = 1
const EXP = 4

export function AttackKnob() {
  const [division, setDivision] = useState(1)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })

  useEffect(() => {
    synth.set({ envelope: { attack: value } })
  }, [])

  return (
    <Knob
      text={`Attack: ${(value * 1000).toFixed(0)}ms`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={div => {
        setDivision(div)
        const newValue = divisionToValue({ division: div, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })
        synth.set({ envelope: { attack: newValue } })
      }}
      title='Attack time'
    />
  )
}
