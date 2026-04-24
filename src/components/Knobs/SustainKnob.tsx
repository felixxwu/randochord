import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50

export function SustainKnob() {
  const [division, setDivision] = useState(1)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: 0, maxValue: 1 })

  console.log(`• value`, value)

  useEffect(() => {
    synth.set({ envelope: { sustain: value } })
  }, [])

  return (
    <Knob
      text={`Sustain: ${value.toFixed(2)}`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={div => {
        setDivision(div)
        const newValue = divisionToValue({ division: div, maxDivisions: MAX_DIVISIONS, minValue: 0, maxValue: 1 })
        synth.set({
          envelope: {
            sustain: newValue,
          },
        })
      }}
      title='Beats per minute'
    />
  )
}
