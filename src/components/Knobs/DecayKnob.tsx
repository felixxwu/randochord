import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50
const MIN_VALUE = 0.01
const MAX_VALUE = 2
const EXP = 3

export function DecayKnob() {
  const [division, setDivision] = useState(10)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })

  useEffect(() => {
    synth.set({ envelope: { decay: value } })
  }, [])

  return (
    <Knob
      text={`Decay: ${value.toFixed(2)}s`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={div => {
        setDivision(div)
        const newValue = divisionToValue({ division: div, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })
        synth.set({ envelope: { decay: newValue } })
      }}
      title='Decay time'
    />
  )
}
