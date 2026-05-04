// ============================================================================
//  src/ui/notes.ts — MIDI note <-> human-readable label
// ============================================================================
//
//  PURPOSE
//  -------
//  The dropdowns in the sequencer show "C4", "F#3", "OFF", etc. — but the
//  engine speaks MIDI note numbers (60 = middle C). This module is the
//  translation layer. Pure data + pure functions, no DOM, no engine refs.
//
//  MIDI numbering in 12-TET (12-tone equal temperament):
//    - One integer per semitone.
//    - C-1 = 0, A4 = 69, C4 = 60.
//    - octave name = floor(midi / 12) - 1.
//    - We use -1 internally to mean "OFF" (no note).
// ============================================================================

export interface NoteOption {
  label: string;
  midi: number; // -1 = OFF
}

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToLabel(midi: number): string {
  if (midi < 0) return 'OFF';
  const octave = Math.floor(midi / 12) - 1;
  return NAMES[midi % 12] + octave;
}

// Precomputed at module load. C3..C5 (two octaves + the high C) plus an
// OFF entry — covers the default arpeggio's top note (C5 = MIDI 72) and
// keeps the dropdown short enough to scan.
export const NOTE_OPTIONS: NoteOption[] = (() => {
  const out: NoteOption[] = [{ label: 'OFF', midi: -1 }];
  for (let m = 48; m <= 72; m++) out.push({ label: midiToLabel(m), midi: m });
  return out;
})();
