import * as Tone from 'tone'
import { allNoteNames } from './getNoteName'
import beat from '../sounds/metronome.wav'

export const synth = new Tone.PolySynth(Tone.Synth, {
    envelope: { release: 0.2 },
}).toDestination()

export const metronome = new Tone.Sampler({ C5: beat }).toDestination()

export function releaseAll(time?: number) {
    synth.triggerRelease(allNoteNames(), time)
}
