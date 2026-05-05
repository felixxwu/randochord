// ============================================================================
//  src/audio/shared-state.ts — UI-side facade for shared memory
// ============================================================================
//
//  Two responsibilities:
//    1. Read the engine's sample counter (so schedulers know "what time is it").
//    2. Push events into the SPSC ring buffer for the engine to consume.
//
//  The byte offsets here mirror src/engine/engine.ts. They MUST stay in sync.
//
//  RING PROTOCOL
//  -------------
//  Single-producer (this side, the UI thread), single-consumer (engine).
//
//  pushEvent():
//    1. Snapshot writeIdx and readIdx atomically.
//    2. Bail with `false` if the ring is full (caller can decide what to do —
//       in practice with a 64-slot ring at our event rate, this never fires).
//    3. Write the four event fields with plain stores.
//    4. Bump writeIdx atomically. The atomic store is a release barrier that
//       publishes the field writes done in step 3 to the engine.
//
//  The engine reads writeIdx with an acquire load and then reads the slot
//  fields with plain loads. Sequential consistency (the JS default) is
//  stronger than required, so we're safe.
// ============================================================================

const STATE_BASE = 1024;
const RING_BASE  = 1280;

// Word-indices (Int32Array element indices) for atomic ops.
const S_SAMPLE_COUNTER  = (STATE_BASE + 0)  >> 2;
const S_ATTACK_MS       = (STATE_BASE + 8)  >> 2;
const S_DECAY_MS        = (STATE_BASE + 12) >> 2;
const S_SUSTAIN_MILLI   = (STATE_BASE + 16) >> 2;
const S_RELEASE_MS      = (STATE_BASE + 20) >> 2;
const S_OSC_TYPE        = (STATE_BASE + 24) >> 2;
const S_VOLUME_MILLI    = (STATE_BASE + 28) >> 2;
const R_WRITE_IDX       = (RING_BASE  + 0)  >> 2;
const R_READ_IDX        = (RING_BASE  + 4)  >> 2;

// Byte offset of the events array (used to compute slot addresses).
const R_EVENTS_BYTES = RING_BASE + 16;
const RING_CAPACITY  = 64;
const RING_MASK      = RING_CAPACITY - 1;
const EVENT_BYTES    = 16;

// Event types — exported so producers (sequencer, future keyboard) can build
// events without importing magic numbers.
export const EV_NOTE_ON  = 1;
export const EV_NOTE_OFF = 2;
export const EV_ALL_OFF  = 3;

// Oscillator types — must match the constants in src/engine/engine.ts.
export const OSC_SQUARE:   number = 0;
export const OSC_SAW:      number = 1;
export const OSC_TRIANGLE: number = 2;
export const OSC_SINE:     number = 3;

export interface AudioEvent {
  type: number;        // EV_*
  note: number;        // MIDI 0..127 (ignored for ALL_OFF)
  velocity?: number;   // 0..127, currently unused
  sampleTime: number;  // absolute sample at which event should fire
}

export class SharedState {
  private readonly i32: Int32Array;

  constructor(memory: WebAssembly.Memory) {
    this.i32 = new Int32Array(memory.buffer);
  }

  // The engine's "what sample am I rendering right now?" counter. UI
  // schedulers read this to decide where in the future to place events.
  readSampleCounter(): number {
    return Atomics.load(this.i32, S_SAMPLE_COUNTER);
  }

  // --- ADSR controls ----------------------------------------------------
  // Engine reads these once per render block. Times in ms; sustain stored
  // as 0..1000 ("milli-units") so we can keep all of shared state as i32.

  setAttackMs(ms: number): void {
    Atomics.store(this.i32, S_ATTACK_MS, Math.max(1, ms | 0));
  }
  setDecayMs(ms: number): void {
    Atomics.store(this.i32, S_DECAY_MS, Math.max(1, ms | 0));
  }
  setSustain(level: number): void {  // 0..1
    const milli = Math.max(0, Math.min(1000, Math.round(level * 1000)));
    Atomics.store(this.i32, S_SUSTAIN_MILLI, milli);
  }
  setReleaseMs(ms: number): void {
    Atomics.store(this.i32, S_RELEASE_MS, Math.max(1, ms | 0));
  }
  setOscillator(type: number): void {
    Atomics.store(this.i32, S_OSC_TYPE, type | 0);
  }
  setVolume(level: number): void {  // 0..1
    const milli = Math.max(0, Math.min(1000, Math.round(level * 1000)));
    Atomics.store(this.i32, S_VOLUME_MILLI, milli);
  }

  // Push one timestamped event into the ring. Returns false if the ring is
  // full (which means the engine is far behind on draining — never happens
  // in practice for our event rate).
  pushEvent(ev: AudioEvent): boolean {
    const writeIdx = Atomics.load(this.i32, R_WRITE_IDX);
    const readIdx  = Atomics.load(this.i32, R_READ_IDX);
    if (writeIdx - readIdx >= RING_CAPACITY) {
      console.warn('[event] ring full — dropping', ev);
      return false;
    }

    const slot = writeIdx & RING_MASK;
    const slotWordBase = (R_EVENTS_BYTES + slot * EVENT_BYTES) >> 2;

    // Plain stores — these MUST happen before the atomic writeIdx bump.
    // Atomics.store on writeIdx then makes them visible to the engine.
    this.i32[slotWordBase + 0] = ev.type;
    this.i32[slotWordBase + 1] = ev.note;
    this.i32[slotWordBase + 2] = ev.velocity ?? 0;
    this.i32[slotWordBase + 3] = ev.sampleTime;

    Atomics.store(this.i32, R_WRITE_IDX, writeIdx + 1);
    return true;
  }
}
