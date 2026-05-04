// ============================================================================
//  src/audio/engine-host.ts — main-thread bootstrap for the audio engine
// ============================================================================
//
//  ROLE
//  ----
//  Wire up the entire audio pipeline from the UI thread. Specifically:
//    1. Allocate the shared WebAssembly.Memory.
//    2. Fetch the wasm bytes (AudioWorkletGlobalScope has no `fetch()`,
//       so we have to do this on the main thread and pass the bytes in).
//    3. Create an AudioContext and load the AudioWorkletProcessor module.
//    4. Build the AudioWorkletNode that hosts our wasm engine, passing it
//       the wasm bytes + memory via processorOptions.
//    5. Connect the node to the audio output.
//    6. Hand the caller a SharedState facade (so they can drive the engine
//       by writing into shared memory) and a `resume()` they can invoke
//       on first user gesture (browser autoplay policy).
//
//  WHO CALLS THIS
//  --------------
//  `src/main.ts` calls `createEngine()` once at startup. The returned
//  EngineHandle is passed into the sequencer UI in `src/ui/sequencer.ts`.
//
//  WHY THIS IS ON THE MAIN THREAD
//  ------------------------------
//  AudioWorkletGlobalScope (where engine-processor.js runs) is intentionally
//  minimal: no DOM, no `fetch()`, no `setTimeout`. It's a real-time audio
//  thread. So *all* setup that needs the network or DOM has to happen here,
//  on the main thread, and the results get handed in via `processorOptions`.
// ============================================================================

import { SharedState } from './shared-state';

export interface EngineHandle {
  // Facade for writing events into shared memory and reading the engine's
  // current sample position.
  state: SharedState;
  // The audio thread's sample rate. Schedulers need this to convert
  // musical time (BPM, ms) into the engine's clock (samples).
  sampleRate: number;
  // The browser blocks AudioContext until a user gesture (autoplay policy).
  // The Play button in `src/ui/sequencer.ts` calls this on first click.
  resume(): Promise<void>;
}

export async function createEngine(): Promise<EngineHandle> {
  // Cross-origin isolation is required for SharedArrayBuffer (and therefore
  // for WebAssembly.Memory({ shared: true })). It's gated by COOP/COEP
  // headers, which we set in `vite.config.ts`. If those headers don't
  // arrive, this property is false and the constructor below would throw a
  // TypeError. We check explicitly to give a clearer error message.
  if (!self.crossOriginIsolated) {
    throw new Error('Page is not cross-origin isolated; SharedArrayBuffer unavailable.');
  }

  // The wasm linear memory IS the shared buffer. Both the main thread (this
  // file) and the worklet thread (engine-processor.js) hold references to
  // this exact memory object. Mutations on one side are visible on the
  // other. We allocate 1 page (64 KiB), which is far more than we need —
  // SharedState fits in 48 bytes and the output buffer is 512 bytes.
  const memory = new WebAssembly.Memory({
    initial: 1,
    maximum: 1,
    shared: true,
  });

  // Fetch the wasm binary on the main thread. We pass the BYTES (not a URL)
  // to the worklet because AudioWorkletGlobalScope cannot fetch.
  // BASE_URL is supplied by Vite (e.g. `/audio-engine/` in production at
  // randochord.web.app/audio-engine/, `/` for a standalone dev server).
  const baseUrl = import.meta.env.BASE_URL;
  const wasmResp = await fetch(baseUrl + 'engine.wasm');
  if (!wasmResp.ok) throw new Error('failed to fetch engine.wasm: ' + wasmResp.status);
  const wasmBytes = await wasmResp.arrayBuffer();

  // The AudioContext owns the audio graph and the audio thread itself.
  // Its sampleRate (44100 or 48000 depending on device) gets passed to the
  // engine via the worklet's `init()` call.
  const audioContext = new AudioContext();

  // Register the AudioWorkletProcessor. The browser will load and execute
  // engine-processor.js inside AudioWorkletGlobalScope. After this resolves,
  // we can construct AudioWorkletNodes referencing the registered name.
  await audioContext.audioWorklet.addModule(baseUrl + 'engine-processor.js');

  // Construct the node. processorOptions are structured-cloned across the
  // boundary, EXCEPT for SharedArrayBuffers / shared WebAssembly.Memory
  // which share storage rather than copying. So the worklet receives the
  // exact same memory object we created above. The wasm bytes are copied,
  // but they're tiny and only crossed once at startup.
  const node = new AudioWorkletNode(audioContext, 'engine', {
    numberOfInputs: 0,                  // we generate audio, we don't consume it
    numberOfOutputs: 1,
    outputChannelCount: [2],            // stereo (we duplicate the mono engine)
    processorOptions: { wasmBytes, memory },
  });

  // Wire the engine's output into the audio destination (your speakers).
  node.connect(audioContext.destination);

  return {
    state: new SharedState(memory),
    sampleRate: audioContext.sampleRate,
    resume: () => audioContext.resume(),
  };
}
