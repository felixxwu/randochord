export type ChordType = number[]

type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type NoteModifier = '' | '#'
type NoteOctave = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type ModeName = '1' | '2' | '3' | '4' | '5' | '6' | '7'
export type NoteName = `${NoteLetter}${NoteModifier}`
export type MidiNoteName = `${NoteName}${NoteOctave}`
export type NoteColour = 'b' | 'w'
export type TabType = 'midi' | 'synth' | 'algorithm' | 'chords'
export type Algorithm = 'diatonic' | 'random' | 'chord planing' | 'ngram'
export type Playback = 'chords' | 'arpeggio'
export type ChordRhythm = 'full' | 'twice' | 'four' | 'dotted'
export type ArpeggioType = 'rise' | 'fall' | 'rise and fall' | 'random'
export type ArpeggioSpeed = 'quarter' | 'eighth' | 'sixteenth' | 'triplet'
export type RandomNoteCount = '3' | '4' | '5' | '6'
export type ExtensionType = 'none' | 'simple' | 'complex' | 'complex+alterations'
export type ChordPlaningType = 'maj' | 'maj7' | 'maj9' | 'maj11' | 'min' | 'min7' | 'min9' | 'min11' | 'copy'

export type MenuList = ({ text: string; callback: () => void } | null)[]
