// @ts-nocheck
//
// (This file runs in AudioWorkletGlobalScope, which has different globals
// than the main-thread Window — `AudioWorkletProcessor`, `registerProcessor`,
// and `sampleRate` are provided by the browser there. VS Code's JS checker
// doesn't know that, so we silence it for this file.)
//
// ============================================================================
//  public/engine-processor.js — AudioWorkletProcessor (wasm host on audio thread)
// ============================================================================
//
//  ROLE
//  ----
//  This file runs on the *audio thread*, inside an AudioWorkletGlobalScope.
//  Its only job is to bridge our wasm engine into the Web Audio graph: each
//  audio quantum, call engine.render(), then copy the engine's output buffer
//  into the AudioWorklet's output channels.
//
//  WHY IS THIS A .JS FILE (NOT .TS)?
//  ---------------------------------
//  AudioWorklet expects a URL pointing at a JS module. Vite's TypeScript
//  bundling pipeline targets Web Workers, not AudioWorklet — they have
//  different module-loading semantics. Putting this file in `public/` makes
//  Vite serve it verbatim, which sidesteps the bundler entirely. The cost
//  is losing TypeScript here — but the file is ~30 lines of glue, not worth
//  building a custom plugin for.
//
//  AudioWorkletGlobalScope CONSTRAINTS
//  -----------------------------------
//  This scope intentionally has no DOM, no `fetch()`, no `setTimeout`, and a
//  very limited subset of globals. The exposed names we use here are:
//    - `AudioWorkletProcessor`, `registerProcessor` — the worklet API
//    - `sampleRate`               — the AudioContext's sample rate
//    - `WebAssembly`              — to instantiate the wasm module
//
//  The processor MUST be cheap and predictable; allocating, GCing, or
//  blocking would cause audible glitches.
// ============================================================================

// These match `src/engine/engine.ts`: the engine writes 128 f32 samples per
// render() call into the output buffer at byte offset 4096. (4096 is past
// the end of the event ring buffer; using 2048 caused the audio writes to
// stomp ring slots 47..63, silently corrupting pushed events.)
const OUT_OFFSET_BYTES = 4096;
const OUT_FRAMES = 128;

class EngineProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();

    // We can't use the wasm exports until WebAssembly.instantiate resolves,
    // but `process()` may be called before then. The `ready` flag gates it.
    this.exports = null;
    this.outView = null;
    this.ready = false;

    // engine-host.ts passed these in via processorOptions. The `memory` is
    // the SAME WebAssembly.Memory object the main thread allocated — shared
    // memory means both sides see each other's writes.
    const { wasmBytes, memory } = options.processorOptions;

    // Instantiate the wasm against the shared memory. Our engine is
    // compiled with `--importMemory`, meaning it does NOT allocate its own
    // memory; we provide it via the import object. That's how we make the
    // wasm linear memory and the JS-visible memory the same memory.
    WebAssembly.instantiate(wasmBytes, { env: { memory } }).then((result) => {
      this.exports = result.instance.exports;

      // `sampleRate` is a magic global in AudioWorkletGlobalScope, set by
      // the browser to the AudioContext's actual sample rate. The engine
      // needs this to compute step timing and oscillator frequency.
      this.exports.init(sampleRate);

      // Wrap the engine's output region in a Float32Array view. Since
      // memory.buffer is the shared buffer, this view aliases the engine's
      // writes — no copy needed, we just read from this view directly.
      this.outView = new Float32Array(memory.buffer, OUT_OFFSET_BYTES, OUT_FRAMES);

      this.ready = true;
    }).catch((err) => {
      // Surface errors back to the main thread for visibility.
      this.port.postMessage({ type: 'error', message: String(err) });
    });
  }

  // process() is called by the browser ~every 2.7 ms (at 48kHz) and MUST
  // return quickly. Returning `true` keeps the processor alive; returning
  // `false` would let the browser garbage-collect us (we never want that).
  process(_inputs, outputs) {
    if (!this.ready) return true;       // silence until wasm is loaded
    const out = outputs[0];
    if (!out || out.length === 0) return true;

    // `frames` is whatever the browser asks for — currently always 128.
    const frames = out[0].length;

    // Tell the wasm engine to render into its output region. After this
    // call returns, this.outView aliases `frames` valid samples.
    this.exports.render(frames);

    // Copy the engine's mono output into both stereo channels. (Could be
    // smarter and route a real stereo engine here later — for the MVP one
    // voice is mono and we duplicate.)
    out[0].set(this.outView.subarray(0, frames));
    if (out.length > 1) out[1].set(this.outView.subarray(0, frames));

    return true;
  }
}

// Register under the same name engine-host.ts uses when constructing the
// AudioWorkletNode (`new AudioWorkletNode(ctx, 'engine', ...)`).
registerProcessor('engine', EngineProcessor);
