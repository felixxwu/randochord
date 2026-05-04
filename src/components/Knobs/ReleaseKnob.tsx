import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50
const MIN_VALUE = 0.01
const MAX_VALUE = 4
const EXP = 4

export function ReleaseKnob() {
  const [division, setDivision] = useState(15)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })

  useEffect(() => {
    synth.set({ envelope: { release: value } })
  }, [])

  return (
    <Knob
      text={`Release: ${value.toFixed(2)}s`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={div => {
        setDivision(div)
        const newValue = divisionToValue({ division: div, maxDivisions: MAX_DIVISIONS, minValue: MIN_VALUE, maxValue: MAX_VALUE, exp: EXP })
        synth.set({ envelope: { release: newValue } })
      }}
      title='Release time'
    />
  )
}
