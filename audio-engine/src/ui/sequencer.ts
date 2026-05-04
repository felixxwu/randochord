// ============================================================================
//  src/ui/sequencer.ts — UI + lookahead scheduler (event PRODUCER)
// ============================================================================
//
//  WHAT CHANGED FROM THE STATE-BASED VERSION
//  -----------------------------------------
//  Previously this file wrote BPM and step values directly into shared
//  memory; the engine read them and ran its own sequencer clock.
//
//  Now the engine is generic — it knows nothing about steps or BPM. This
//  file owns the musical logic. It maintains `pattern` and `bpm` as plain
//  JS state, and runs a low-frequency scheduler (every 25 ms) that pushes
//  timestamped NOTE_ON / NOTE_OFF events into the engine's ring buffer
//  for any step boundaries falling in the next ~100 ms.
//
//  This is the standard "two clocks" pattern (Chris Wilson, "A Tale of
//  Two Clocks"): a coarse main-thread scheduler combined with a
//  sample-accurate audio-thread consumer. Timing accuracy comes from the
//  events' timestamps, not from when the scheduler happens to run.
//
//  WHY THIS REFACTOR
//  -----------------
//  Live keyboard input becomes trivial: the keyboard's pointer handler
//  just pushes NOTE_ON / NOTE_OFF events with `sampleTime = now + margin`,
//  using the same ring, against the same engine, with no engine changes.
//  Same goes for any future producer (recorded MIDI, automation, etc.).
// ============================================================================

import { EV_NOTE_ON, EV_NOTE_OFF, EV_ALL_OFF } from '../audio/shared-state';
import type { SharedState } from '../audio/shared-state';
import { NOTE_OPTIONS } from './notes';

const DEFAULT_PATTERN = [60, 64, 67, 72, 60, 64, 67, 72]; // C-major arp
const DEFAULT_BPM = 120;

// How far ahead of the playhead we keep events queued. Larger = safer
// against scheduler jitter, but pattern/bpm changes take longer to apply
// (changes don't affect already-queued events). 100 ms is comfortable.
const LOOKAHEAD_MS = 100;
const SCHEDULER_INTERVAL_MS = 25;

// Tiny gap before scheduling the very first step so the engine has time
// to dequeue without racing with our pushEvent call.
const PLAY_START_MARGIN_MS = 50;

// Each step holds for this fraction of its time slot before NOTE_OFF fires.
// Leaving a gap lets the envelope release before the next NOTE_ON, which
// keeps the rhythm articulated rather than a continuous slur.
const NOTE_HOLD_FRACTION = 0.85;

export interface SequencerHandle {
  destroy(): void;
  isPlaying(): boolean;
}

export function mountSequencer(
  root: HTMLElement,
  state: SharedState,
  sampleRate: number,
  onPlay: () => Promise<void>,
  // Notified whenever play/stop changes, so other UI (the keyboard) can
  // disable itself while the loop is running.
  onPlayingChange?: (playing: boolean) => void,
): SequencerHandle {
  // --- Build DOM (unchanged structurally) -------------------------------
  root.innerHTML = `
    <div class="sequencer">
      <div class="row controls">
        <button id="play" type="button">Play</button>
        <label>BPM <input id="bpm" type="number" min="60" max="240" step="1" value="${DEFAULT_BPM}" /></label>
      </div>
      <div class="row steps" id="steps"></div>
      <div class="row playhead" id="playhead">
        ${Array.from({ length: 8 }, (_, i) => `<div class="cell" data-i="${i}"></div>`).join('')}
      </div>
    </div>
  `;

  // --- Local musical state (no longer in shared memory!) ----------------
  const pattern: number[] = [...DEFAULT_PATTERN];
  let bpm: number = DEFAULT_BPM;
  let playing = false;

  // Scheduler state — only meaningful while `playing == true`.
  let nextStep = 0;            // index 0..7 of the next step to be scheduled
  let nextStepSample = 0;      // absolute sample time at which it fires
  let intervalId: number = 0;  // setInterval handle for the scheduler

  // For playhead UI: when did we start playing? We derive the current step
  // from (now - playStartSample) / samplesPerStep. Because the scheduler is
  // already queueing notes, we use the same `nextStep`-based tracking too.
  let playStartSample = 0;

  function samplesPerStep(): number {
    // 8th notes: one step every (60 / bpm / 2) seconds.
    return Math.round(sampleRate * 30 / bpm);
  }

  // --- The lookahead scheduler -----------------------------------------
  //
  // Called frequently (every 25 ms). On each call: while the next step's
  // start sample is within the lookahead horizon, push its NOTE_ON and
  // NOTE_OFF events into the ring with the right absolute timestamps.
  // The engine drains these sample-accurately on its end.
  function schedule(): void {
    if (!playing) return;
    const now = state.readSampleCounter();
    const horizonSamples = Math.round(sampleRate * LOOKAHEAD_MS / 1000);
    const horizon = now + horizonSamples;
    const stepLen = samplesPerStep();
    const holdLen = Math.round(stepLen * NOTE_HOLD_FRACTION);

    while (nextStepSample < horizon) {
      const note = pattern[nextStep];
      if (note >= 0) {
        state.pushEvent({
          type: EV_NOTE_ON,
          note,
          sampleTime: nextStepSample,
        });
        state.pushEvent({
          type: EV_NOTE_OFF,
          note,
          sampleTime: nextStepSample + holdLen,
        });
      }
      // (If note < 0 / OFF, we just skip — no events for an OFF step.)
      nextStepSample += stepLen;
      nextStep = (nextStep + 1) & 7;
    }
  }

  // --- Step dropdowns ---------------------------------------------------
  const stepsRow = root.querySelector<HTMLDivElement>('#steps')!;
  for (let i = 0; i < 8; i++) {
    const sel = document.createElement('select');
    for (const opt of NOTE_OPTIONS) {
      const o = document.createElement('option');
      o.value = String(opt.midi);
      o.textContent = opt.label;
      sel.appendChild(o);
    }
    sel.value = String(DEFAULT_PATTERN[i]);
    sel.addEventListener('change', () => {
      pattern[i] = parseInt(sel.value, 10);
      // Note: events already queued in the engine's ring (within the
      // ~100 ms lookahead) will play with the OLD pattern value. New
      // events scheduled after this point pick up the new value. For an
      // MVP this small staleness window is acceptable.
    });
    stepsRow.appendChild(sel);
  }

  // --- BPM input -------------------------------------------------------
  const bpmInput = root.querySelector<HTMLInputElement>('#bpm')!;
  bpmInput.addEventListener('input', () => {
    const v = parseInt(bpmInput.value, 10);
    if (Number.isFinite(v) && v >= 30 && v <= 300) {
      bpm = v;
      // Same caveat as pattern changes: queued events keep old BPM. The
      // next scheduling pass uses the new tempo from `nextStepSample`
      // onward. There is a tiny rhythmic glitch at the change point;
      // imperceptible at typical BPM tweaks.
    }
  });

  // --- Play / Stop -----------------------------------------------------
  const playBtn = root.querySelector<HTMLButtonElement>('#play')!;
  playBtn.addEventListener('click', async () => {
    if (!playing) {
      // First click is the user gesture that satisfies the autoplay policy.
      await onPlay();
      const now = state.readSampleCounter();
      // Aim the first step a bit into the future so the engine has time
      // to dequeue. PLAY_START_MARGIN_MS ≈ 50 ms is plenty.
      const margin = Math.round(sampleRate * PLAY_START_MARGIN_MS / 1000);
      nextStep = 0;
      nextStepSample = now + margin;
      playStartSample = nextStepSample;
      playing = true;
      schedule();                                    // fill initial lookahead
      intervalId = window.setInterval(schedule, SCHEDULER_INTERVAL_MS);
      playBtn.textContent = 'Stop';
      onPlayingChange?.(true);
    } else {
      playing = false;
      window.clearInterval(intervalId);
      onPlayingChange?.(false);
      // Silence whatever's currently sounding. ALL_OFF event with timestamp
      // = "now" forces the engine to release immediately on next render.
      const now = state.readSampleCounter();
      state.pushEvent({ type: EV_ALL_OFF, note: 0, sampleTime: now });
      playBtn.textContent = 'Play';
    }
  });

  // --- Playhead indicator ----------------------------------------------
  // Derive current step from elapsed samples since play started. This
  // drifts slightly when BPM changes mid-play (since the formula uses
  // current BPM, not the BPM history) — acceptable for a visual indicator.
  const cells = Array.from(root.querySelectorAll<HTMLDivElement>('#playhead .cell'));
  let raf = 0;
  const tick = () => {
    if (playing) {
      const now = state.readSampleCounter();
      const elapsed = now - playStartSample;
      const cur = elapsed >= 0 ? Math.floor(elapsed / samplesPerStep()) & 7 : -1;
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.toggle('active', i === cur);
      }
    } else {
      for (const c of cells) c.classList.remove('active');
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    destroy: () => {
      cancelAnimationFrame(raf);
      if (intervalId) window.clearInterval(intervalId);
    },
    isPlaying: () => playing,
  };
}
