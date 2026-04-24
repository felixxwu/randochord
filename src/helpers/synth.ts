import * as Tone from 'tone'
import beat from '../sounds/metronome.wav'

export const DEFAULT_POLYPHONY = 32
export const MIN_POLYPHONY = 1
export const MAX_POLYPHONY = 32

let voiceOptions: Parameters<Tone.Synth['set']>[0] = {}

function makeVoice() {
  return new Tone.Synth(voiceOptions).toDestination()
}

const voices: Tone.Synth[] = Array.from({ length: DEFAULT_POLYPHONY }, makeVoice)

let rrIndex = 0

type Assignment = { note: string; voice: Tone.Synth }
const active: Assignment[] = []

export const synth = {
  set(options: Parameters<Tone.Synth['set']>[0]) {
    voiceOptions = { ...voiceOptions, ...options }
    for (const v of voices) v.set(options)
  },
}

export function setPolyphony(count: number) {
  const target = Math.max(MIN_POLYPHONY, Math.min(MAX_POLYPHONY, Math.floor(count)))
  while (voices.length > target) {
    const removed = voices.pop()!
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].voice === removed) active.splice(i, 1)
    }
    removed.triggerRelease()
    removed.dispose()
  }
  while (voices.length < target) {
    voices.push(makeVoice())
  }
  rrIndex = rrIndex % voices.length
}

export function getPolyphony() {
  return voices.length
}

export const metronome = new Tone.Sampler({ C5: beat }).toDestination()

export function attackNotes(notes: string[], time?: number, velocity?: number) {
  for (const note of notes) {
    const voice = voices[rrIndex]
    rrIndex = (rrIndex + 1) % voices.length

    const oldIdx = active.findIndex(a => a.voice === voice)
    if (oldIdx !== -1) active.splice(oldIdx, 1)

    voice.triggerAttack(note, time, velocity)
    active.push({ note, voice })
  }
}

export function releaseNotes(notes: string[], time?: number) {
  for (const note of notes) {
    const idx = active.findIndex(a => a.note === note)
    if (idx === -1) continue
    active[idx].voice.triggerRelease(time)
    active.splice(idx, 1)
  }
}

export function releaseAll(time?: number) {
  for (const v of voices) v.triggerRelease(time)
  active.length = 0
}
