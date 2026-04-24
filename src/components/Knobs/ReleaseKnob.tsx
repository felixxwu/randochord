import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50

export function ReleaseKnob() {
  const [division, setDivision] = useState(30)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: 0.1, maxValue: 10, exp: 2 })

  useEffect(() => {
    synth.set({ envelope: { release: value } })
  }, [])

  return (
    <Knob
      text={`Release: ${value.toFixed(2)}ms`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={value => {
        setDivision(value)
        synth.set({
          envelope: {
            release: value,
          },
        })
      }}
      title='Beats per minute'
    />
  )
}
