export type ChordType = number[]

type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type NoteModifier = '' | '#'
type NoteOctave = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type NoteName = `${NoteLetter}${NoteModifier}${NoteOctave}`
export type NoteColour = 'b' | 'w'

export type TabType = 'midi' | 'synth' | 'algorithm'
