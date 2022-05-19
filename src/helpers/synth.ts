import * as Tone from 'tone'
import { allNoteNames } from './getNoteName'

export const synth = new Tone.PolySynth(Tone.Synth, {
    envelope: { release: 0.2 },
}).toDestination()

export function releaseAll(time?: number) {
    synth.triggerRelease(allNoteNames(), time)
}
