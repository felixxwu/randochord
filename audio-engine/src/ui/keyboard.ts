// ============================================================================
//  src/ui/keyboard.ts — polyphonic live keyboard (event PRODUCER)
// ============================================================================
//
//  ROLE
//  ----
//  An event producer alongside the sequencer in src/ui/sequencer.ts. Pushes
//  NOTE_ON / NOTE_OFF into the same ring buffer; the engine doesn't care
//  who the producer is.
//
//  SCOPE
//  -----
//  - One octave (C4..B4), MIDI 60..71
//  - Pointer events (mouse / touch / pen)
//  - POLYPHONIC: each pointer (finger / cursor) tracks its own held note;
//    multiple keys can be held simultaneously, up to the engine's voice pool.
//  - Disabled while the sequencer is running (CSS pointer-events: none, plus
//    a defensive isAllowed() check in JS).
//
//  POLYPHONY MODEL
//  ---------------
//  We track held notes by `pointerId` rather than by MIDI note. Each
//  pointerdown captures the pointer and pushes a NOTE_ON; each pointerup
//  for that pointer pushes the matching NOTE_OFF. This allows one pointer
//  per finger on touch, and naturally supports overlapping notes from
//  multiple input devices (mouse + trackpad + touch).
// ============================================================================

import { EV_NOTE_ON, EV_NOTE_OFF } from '../audio/shared-state';
import type { SharedState } from '../audio/shared-state';

const LIVE_INPUT_MARGIN_MS = 5;

interface Key { midi: number; label: string; }
const WHITE_KEYS: Key[] = [
  { midi: 60, label: 'C'  },
  { midi: 62, label: 'D'  },
  { midi: 64, label: 'E'  },
  { midi: 65, label: 'F'  },
  { midi: 67, label: 'G'  },
  { midi: 69, label: 'A'  },
  { midi: 71, label: 'B'  },
];
interface BlackKey extends Key { whiteIndex: number; }
const BLACK_KEYS: BlackKey[] = [
  { midi: 61, label: 'C#', whiteIndex: 0 },
  { midi: 63, label: 'D#', whiteIndex: 1 },
  { midi: 66, label: 'F#', whiteIndex: 3 },
  { midi: 68, label: 'G#', whiteIndex: 4 },
  { midi: 70, label: 'A#', whiteIndex: 5 },
];

export interface KeyboardHandle {
  destroy(): void;
}

export function mountKeyboard(
  root: HTMLElement,
  state: SharedState,
  sampleRate: number,
  onFirstInteraction: () => Promise<void>,
  isAllowed: () => boolean,
): KeyboardHandle {
  // --- DOM construction --------------------------------------------------
  const keyboardEl = document.createElement('div');
  keyboardEl.className = 'keyboard';

  const whiteRow = document.createElement('div');
  whiteRow.className = 'white-row';

  const allKeyEls: HTMLDivElement[] = [];

  for (const k of WHITE_KEYS) {
    const el = document.createElement('div');
    el.className = 'white-key';
    el.dataset.midi = String(k.midi);
    el.textContent = k.label;
    whiteRow.appendChild(el);
    allKeyEls.push(el);
  }

  const blackOverlay = document.createElement('div');
  blackOverlay.className = 'black-overlay';
  for (const k of BLACK_KEYS) {
    const el = document.createElement('div');
    el.className = 'black-key';
    el.dataset.midi = String(k.midi);
    el.textContent = k.label;
    const leftPercent = ((k.whiteIndex + 1) / WHITE_KEYS.length) * 100;
    el.style.left = `calc(${leftPercent}% - 3%)`;
    blackOverlay.appendChild(el);
    allKeyEls.push(el);
  }

  keyboardEl.appendChild(whiteRow);
  keyboardEl.appendChild(blackOverlay);
  root.appendChild(keyboardEl);

  // --- State ------------------------------------------------------------
  // Map pointerId → MIDI note. Each pointer (finger / mouse cursor) tracks
  // its own held note independently. This is what gives us polyphony from
  // multi-touch input naturally.
  const heldByPointer = new Map<number, number>();
  let firstClickHandled = false;

  function nowSample(): number { return state.readSampleCounter(); }
  function marginSamples(): number {
    return Math.round(sampleRate * LIVE_INPUT_MARGIN_MS / 1000);
  }
  function midiOf(el: HTMLElement): number | null {
    const v = el.dataset.midi;
    return v ? parseInt(v, 10) : null;
  }
  function isAnyPointerHolding(midi: number): boolean {
    for (const m of heldByPointer.values()) if (m === midi) return true;
    return false;
  }
  function highlight(midi: number, on: boolean): void {
    const el = keyboardEl.querySelector<HTMLDivElement>(`[data-midi="${midi}"]`);
    if (el) el.classList.toggle('pressed', on);
  }

  function pressFromPointer(pointerId: number, midi: number): void {
    heldByPointer.set(pointerId, midi);
    state.pushEvent({
      type: EV_NOTE_ON,
      note: midi,
      sampleTime: nowSample() + marginSamples(),
    });
    highlight(midi, true);
  }

  function releaseFromPointer(pointerId: number): void {
    const midi = heldByPointer.get(pointerId);
    if (midi === undefined) return;
    heldByPointer.delete(pointerId);
    state.pushEvent({
      type: EV_NOTE_OFF,
      note: midi,
      sampleTime: nowSample() + marginSamples(),
    });
    // Only un-highlight if no other pointer is still holding this note
    // (e.g. two fingers on the same key, one lifts).
    if (!isAnyPointerHolding(midi)) highlight(midi, false);
  }

  // --- Event handlers ---------------------------------------------------
  async function onDown(ev: PointerEvent): Promise<void> {
    if (!isAllowed()) return;
    const target = ev.target as HTMLElement;
    const midi = midiOf(target);
    if (midi === null) return;
    ev.preventDefault();
    target.setPointerCapture?.(ev.pointerId);

    if (!firstClickHandled) {
      firstClickHandled = true;
      await onFirstInteraction();
    }

    pressFromPointer(ev.pointerId, midi);
  }

  function onUp(ev: PointerEvent): void {
    releaseFromPointer(ev.pointerId);
  }

  function onCancelAll(): void {
    // Copy keys before iterating since releaseFromPointer mutates the map.
    const ids = Array.from(heldByPointer.keys());
    for (const id of ids) releaseFromPointer(id);
  }

  for (const el of allKeyEls) {
    el.addEventListener('pointerdown', onDown);
  }
  // Window-level catches releases that happen outside the keyboard
  // (drag-off, window blur, browser swallowing the event).
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  window.addEventListener('blur', onCancelAll);

  return {
    destroy(): void {
      for (const el of allKeyEls) el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onCancelAll);
      onCancelAll();
      keyboardEl.remove();
    },
  };
}
