// ============================================================================
//  src/engine/engine.ts — polyphonic event-driven synth (AS → wasm)
// ============================================================================
//
//  ARCHITECTURE
//  ------------
//  Generic event-driven synthesizer:
//    1. Drains a ring buffer of timestamped events at sample-accurate boundaries.
//    2. Maintains a fixed-size POOL of voices, each with its own oscillator
//       and envelope.
//    3. Sums all active voices into the shared output buffer per render call.
//
//  The voice pool is the only meaningful change from the monophonic version.
//  The event bus, ring protocol, scheduler, AudioWorklet host, and producers
//  are all unchanged — that's the test for whether the architecture was right.
//
//  VOICE LIFECYCLE
//  ---------------
//  Each voice transitions through:
//    IDLE  →  ATTACK  →  SUSTAIN  →  RELEASE  →  IDLE
//
//  - NOTE_ON allocates a voice (free first, oldest-releasing next, oldest-active
//    last as a "voice steal").
//  - NOTE_OFF finds the voice whose note matches and is in ATTACK or SUSTAIN,
//    transitions it to RELEASE.
//  - ALL_OFF transitions every active voice to RELEASE.
//
//  MEMORY LAYOUT
//  -------------
//    +0    .. 1023   AS internal
//    +1024 .. 1027   sampleCounter (i32)
//    +1280 .. 2319   ring buffer
//    +4096 .. 4607   output buffer (128 × f32)
//    +5120 .. 5311   voice pool (NUM_VOICES × VOICE_BYTES = 8 × 24 = 192 bytes)
//
//  Per-voice slot layout (24 bytes):
//    +0    phase     (f32)
//    +4    freq      (f32)
//    +8    env       (f32)
//    +12   stage     (i32)  ENV_*
//    +16   note      (i32)  MIDI 0..127, or -1 if free
//    +20   startedAt (i32)  totalSamples value when voice was last allocated
//                            (used to pick the oldest voice for stealing)
// ============================================================================

// --- Memory layout constants ----------------------------------------------

const STATE_BASE:  usize = 1024;
const RING_BASE:   usize = 1280;
const OUT_BASE:    usize = 4096;
const VOICES_BASE: usize = 5120;

const S_SAMPLE_COUNTER:  usize = STATE_BASE + 0;
// ADSR — UI writes, engine reads once per render.
const S_ATTACK_MS:       usize = STATE_BASE + 8;
const S_DECAY_MS:        usize = STATE_BASE + 12;
const S_SUSTAIN_MILLI:   usize = STATE_BASE + 16;  // 0..1000 (sustain × 1000)
const S_RELEASE_MS:      usize = STATE_BASE + 20;
const S_OSC_TYPE:        usize = STATE_BASE + 24;  // OSC_*
const S_VOLUME_MILLI:    usize = STATE_BASE + 28;  // 0..1000 (volume × 1000)

// Oscillator waveforms
const OSC_SQUARE:   i32 = 0;
const OSC_SAW:      i32 = 1;
const OSC_TRIANGLE: i32 = 2;
const OSC_SINE:     i32 = 3;
const TWO_PI: f32 = 6.2831853;

const R_WRITE_IDX: usize = RING_BASE + 0;
const R_READ_IDX:  usize = RING_BASE + 4;
const R_EVENTS:    usize = RING_BASE + 16;
const RING_MASK:   i32   = 63;
const EVENT_BYTES: i32   = 16;

// Event types
const EV_NOTE_ON:  i32 = 1;
const EV_NOTE_OFF: i32 = 2;
const EV_ALL_OFF:  i32 = 3;

// Envelope stages — IDLE is 0 so zero-initialised memory means "all voices idle"
const ENV_IDLE:    i32 = 0;
const ENV_ATTACK:  i32 = 1;
const ENV_DECAY:   i32 = 2;
const ENV_SUSTAIN: i32 = 3;
const ENV_RELEASE: i32 = 4;

// Voice pool
const NUM_VOICES:  i32 = 8;
const VOICE_BYTES: i32 = 24;

// Voice slot field offsets
const V_PHASE:      i32 = 0;
const V_FREQ:       i32 = 4;
const V_ENV:        i32 = 8;
const V_STAGE:      i32 = 12;
const V_NOTE:       i32 = 16;
const V_STARTED_AT: i32 = 20;

// --- Per-instance globals --------------------------------------------------

let sampleRate: f32 = 48000.0;
let totalSamples: i32 = 0;

// --- Lifecycle -------------------------------------------------------------

export function init(sr: f32): void {
  sampleRate = sr;
}

function voiceBase(v: i32): usize {
  return VOICES_BASE + (<usize>v * <usize>VOICE_BYTES);
}

function midiToHz(note: i32): f32 {
  return 440.0 * Mathf.pow(2.0, f32(note - 69) / 12.0);
}

// --- Voice allocation -----------------------------------------------------
//
// Three-pass policy:
//   1. Any voice in ENV_IDLE          (free — no audible disruption)
//   2. The oldest voice in ENV_RELEASE (stealing a fading voice masks the
//                                       discontinuity in its tail)
//   3. The oldest active voice         (steal — audible click, but rare)

function allocateVoice(): i32 {
  // Pass 1: free voice
  for (let v: i32 = 0; v < NUM_VOICES; v++) {
    if (load<i32>(voiceBase(v) + V_STAGE) == ENV_IDLE) return v;
  }
  // Pass 2: oldest releasing voice
  let oldestRel: i32 = -1;
  let oldestRelTime: i32 = i32.MAX_VALUE;
  for (let v: i32 = 0; v < NUM_VOICES; v++) {
    const base = voiceBase(v);
    if (load<i32>(base + V_STAGE) == ENV_RELEASE) {
      const t = load<i32>(base + V_STARTED_AT);
      if (t < oldestRelTime) { oldestRelTime = t; oldestRel = v; }
    }
  }
  if (oldestRel >= 0) return oldestRel;
  // Pass 3: oldest active voice (FIFO stealing)
  let oldest: i32 = 0;
  let oldestTime: i32 = load<i32>(voiceBase(0) + V_STARTED_AT);
  for (let v: i32 = 1; v < NUM_VOICES; v++) {
    const t = load<i32>(voiceBase(v) + V_STARTED_AT);
    if (t < oldestTime) { oldestTime = t; oldest = v; }
  }
  return oldest;
}

// --- Event application ----------------------------------------------------

// "Voice is currently sounding (not idle and not already releasing)" —
// includes ATTACK, DECAY, SUSTAIN. RELEASE is excluded: re-releasing a
// fading voice would interrupt its tail.
function isHolding(stage: i32): bool {
  return stage == ENV_ATTACK || stage == ENV_DECAY || stage == ENV_SUSTAIN;
}

function applyEvent(type: i32, note: i32): void {
  if (type == EV_NOTE_ON) {
    const v = allocateVoice();
    const base = voiceBase(v);
    store<f32>(base + V_PHASE, 0.0);
    store<f32>(base + V_FREQ,  midiToHz(note));
    store<f32>(base + V_ENV,   0.0);
    store<i32>(base + V_STAGE, ENV_ATTACK);
    store<i32>(base + V_NOTE,  note);
    store<i32>(base + V_STARTED_AT, totalSamples);
  } else if (type == EV_NOTE_OFF) {
    for (let v: i32 = 0; v < NUM_VOICES; v++) {
      const base = voiceBase(v);
      const stage = load<i32>(base + V_STAGE);
      if (isHolding(stage) && load<i32>(base + V_NOTE) == note) {
        store<i32>(base + V_STAGE, ENV_RELEASE);
        return;
      }
    }
  } else if (type == EV_ALL_OFF) {
    for (let v: i32 = 0; v < NUM_VOICES; v++) {
      const base = voiceBase(v);
      if (isHolding(load<i32>(base + V_STAGE))) {
        store<i32>(base + V_STAGE, ENV_RELEASE);
      }
    }
  }
}

// --- Hot path --------------------------------------------------------------

export function render(frames: i32): void {
  const writeIdx: i32 = atomic.load<i32>(R_WRITE_IDX);
  let readIdx: i32 = atomic.load<i32>(R_READ_IDX);

  // --- Read ADSR parameters once per block ----------------------------
  // Times in milliseconds, sustain stored as 0..1000 ("milli-units" so we
  // don't need f32 in shared memory). Defended against zero/negative.
  let attackMs:  i32 = atomic.load<i32>(S_ATTACK_MS);
  let decayMs:   i32 = atomic.load<i32>(S_DECAY_MS);
  let releaseMs: i32 = atomic.load<i32>(S_RELEASE_MS);
  if (attackMs  < 1) attackMs  = 1;
  if (decayMs   < 1) decayMs   = 1;
  if (releaseMs < 1) releaseMs = 1;
  let sustainMilli: i32 = atomic.load<i32>(S_SUSTAIN_MILLI);
  if (sustainMilli < 0)    sustainMilli = 0;
  if (sustainMilli > 1000) sustainMilli = 1000;
  const sustainLevel: f32 = f32(sustainMilli) * 0.001;

  // Linear deltas for attack and decay; exponential coefficient for release.
  // (Linear release would stall when sustainLevel is small; exponential
  // gives a consistent perceived "tail length" regardless of start level.)
  const attackPerSample: f32 = 1.0 / (sampleRate * f32(attackMs) * 0.001);
  const decayPerSample:  f32 = (1.0 - sustainLevel) / (sampleRate * f32(decayMs) * 0.001);
  // releaseCoef chosen so envLevel drops by ~60 dB over releaseMs:
  //   coef^N = 0.001  →  coef = exp(ln(0.001) / N) = exp(-6.908 / N)
  const releaseSamples: f32 = sampleRate * f32(releaseMs) * 0.001;
  const releaseCoef: f32 = Mathf.exp(-6.908 / releaseSamples);

  const sampleRateRecip: f32 = 1.0 / sampleRate;

  // Oscillator type — clamped to the known set.
  let oscType: i32 = atomic.load<i32>(S_OSC_TYPE);
  if (oscType < 0 || oscType > 3) oscType = OSC_SQUARE;

  // Master volume — 0..1000 milli-units → 0..1.
  let volumeMilli: i32 = atomic.load<i32>(S_VOLUME_MILLI);
  if (volumeMilli < 0)    volumeMilli = 0;
  if (volumeMilli > 1000) volumeMilli = 1000;
  const volume: f32 = f32(volumeMilli) * 0.001;

  for (let i: i32 = 0; i < frames; i++) {
    const absSample: i32 = totalSamples;

    // Drain events whose timestamps have arrived.
    while (readIdx != writeIdx) {
      const slot: i32 = readIdx & RING_MASK;
      const evBase: usize = R_EVENTS + (<usize>slot * <usize>EVENT_BYTES);
      const evTime: i32 = load<i32>(evBase + 12);
      if (evTime > absSample) break;
      const evType: i32 = load<i32>(evBase + 0);
      const evNote: i32 = load<i32>(evBase + 4);
      applyEvent(evType, evNote);
      readIdx++;
    }

    // --- Mix all active voices for this sample ------------------------
    let mix: f32 = 0.0;

    for (let v: i32 = 0; v < NUM_VOICES; v++) {
      const base = voiceBase(v);
      let stage: i32 = load<i32>(base + V_STAGE);
      if (stage == ENV_IDLE) continue;

      let env: f32 = load<f32>(base + V_ENV);

      // Envelope state machine
      if (stage == ENV_ATTACK) {
        env += attackPerSample;
        if (env >= 1.0) {
          env = 1.0;
          // If sustain is already at the peak, skip decay altogether.
          stage = sustainLevel >= 1.0 ? ENV_SUSTAIN : ENV_DECAY;
          store<i32>(base + V_STAGE, stage);
        }
      } else if (stage == ENV_DECAY) {
        env -= decayPerSample;
        if (env <= sustainLevel) {
          env = sustainLevel;
          stage = ENV_SUSTAIN;
          store<i32>(base + V_STAGE, stage);
        }
      } else if (stage == ENV_RELEASE) {
        env *= releaseCoef;
        if (env < 0.0001) {
          // Voice has fully faded — return it to the pool.
          store<i32>(base + V_STAGE, ENV_IDLE);
          store<i32>(base + V_NOTE, -1);
          store<f32>(base + V_ENV, 0.0);
          continue;
        }
      }
      // ENV_SUSTAIN: hold envLevel as-is.
      store<f32>(base + V_ENV, env);

      // Oscillator advance
      let phase: f32 = load<f32>(base + V_PHASE);
      const freq: f32 = load<f32>(base + V_FREQ);
      phase += freq * sampleRateRecip;
      if (phase >= 1.0) phase -= 1.0;
      store<f32>(base + V_PHASE, phase);

      // Compute waveform sample at current phase, naive (no anti-aliasing).
      // Branch per sample is cheap at our voice count; could be hoisted
      // into separate loops per oscType for tighter code in hot DSP paths.
      let wave: f32;
      if (oscType == OSC_SQUARE) {
        wave = phase < 0.5 ? 1.0 : -1.0;
      } else if (oscType == OSC_SAW) {
        wave = 2.0 * phase - 1.0;
      } else if (oscType == OSC_TRIANGLE) {
        wave = phase < 0.5 ? (4.0 * phase - 1.0) : (3.0 - 4.0 * phase);
      } else {
        wave = Mathf.sin(TWO_PI * phase);
      }
      mix += wave * env;
    }

    // Headroom + cheap hard clip (proper saturation/limiter would go here
    // in a real engine; for an MVP, clipping is acceptable when 8 voices
    // pile up at full envelope).
    let out: f32 = mix * 0.15 * volume;
    if (out >  1.0) out =  1.0;
    if (out < -1.0) out = -1.0;
    store<f32>(OUT_BASE + (<usize>i << 2), out);

    totalSamples++;
  }

  atomic.store<i32>(R_READ_IDX, readIdx);
  atomic.store<i32>(S_SAMPLE_COUNTER, totalSamples);
}
