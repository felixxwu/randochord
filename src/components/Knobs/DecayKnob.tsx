import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50

export function DecayKnob() {
  const [division, setDivision] = useState(10)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: 0.1, maxValue: 10, exp: 2 })

  useEffect(() => {
    synth.set({ envelope: { decay: value } })
  }, [])

  return (
    <Knob
      text={`Decay: ${value.toFixed(2)}ms`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={value => {
        setDivision(value)
        synth.set({
          envelope: {
            decay: value,
          },
        })
      }}
      title='Beats per minute'
    />
  )
}
