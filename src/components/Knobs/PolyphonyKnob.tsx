import { getPolyphony, MAX_POLYPHONY, MIN_POLYPHONY, setPolyphony } from '../../helpers/synth'
import { Knob } from '../Knob'
import { useState } from 'react'

export function PolyphonyKnob() {
  const [polyphony, setPolyphonyState] = useState(getPolyphony())

  return (
    <Knob
      text={`Polyphony: ${polyphony}`}
      divisions={MAX_POLYPHONY - MIN_POLYPHONY}
      scrollStep={1}
      value={polyphony - MIN_POLYPHONY}
      onTurn={v => {
        const count = v + MIN_POLYPHONY
        setPolyphonyState(count)
        setPolyphony(count)
      }}
      title='Voice count'
    />
  )
}
