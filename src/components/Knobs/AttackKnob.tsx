import { useEffect, useState } from 'react'
import { Knob } from '../Knob'
import { synth } from '../../helpers/synth'
import { divisionToValue } from '../../helpers/divisionToValue'

const MAX_DIVISIONS = 50

export function AttackKnob() {
  const [division, setDivision] = useState(1)

  const value = divisionToValue({ division, maxDivisions: MAX_DIVISIONS, minValue: 0, maxValue: 0.5, exp: 2 })

  useEffect(() => {
    synth.set({ envelope: { attack: value } })
  }, [])

  return (
    <Knob
      text={`Attack: ${value.toFixed(2)}ms`}
      divisions={MAX_DIVISIONS}
      scrollStep={1}
      value={division}
      onTurn={value => {
        setDivision(value)
        synth.set({
          envelope: {
            attack: value,
          },
        })
      }}
      title='Beats per minute'
    />
  )
}
