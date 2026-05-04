// ============================================================================
//  src/main.ts — application entry point
// ============================================================================
//
//  1. Mount the HTML shell.
//  2. Bootstrap the engine (createEngine — see src/audio/engine-host.ts).
//  3. Mount two event PRODUCERS that share one engine:
//       - the sequencer (lookahead scheduler driving steps)
//       - the live keyboard (mouse-played one-octave keyboard)
//     They push into the same ring buffer; the engine doesn't distinguish.
//
//  COORDINATION
//  ------------
//  Keyboard and sequencer share the engine's 8-voice pool. Both can produce
//  events at the same time; the engine's voice allocator handles overlap.
//  (The sequencer occupies at most one voice per step; the keyboard takes
//  the rest. Stealing only kicks in if you hold 8+ keys simultaneously.)
// ============================================================================

import './style.css';
import { createEngine } from './audio/engine-host';
import { mountSequencer } from './ui/sequencer';
import { mountKeyboard } from './ui/keyboard';
import { mountAdsrControls } from './ui/adsr-controls';
import { mountOscillatorSelect } from './ui/oscillator-select';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

app.innerHTML = `
  <h1>Audio Engine</h1>
  <p id="status">initialising…</p>
  <div id="seq"></div>
  <h2>Synth</h2>
  <div id="osc"></div>
  <h2>Envelope</h2>
  <div id="adsr"></div>
  <h2>Live keyboard</h2>
  <p class="hint">Click the keys (mouse or touch). Plays alongside the sequencer.</p>
  <div id="kb"></div>
`;

const status = document.getElementById('status')!;
const seqRoot = document.getElementById('seq')!;
const oscRoot = document.getElementById('osc')!;
const adsrRoot = document.getElementById('adsr')!;
const kbRoot = document.getElementById('kb')!;

createEngine().then((engine) => {
  status.textContent = 'ready — press Play, or click a key';

  mountSequencer(
    seqRoot,
    engine.state,
    engine.sampleRate,
    () => engine.resume(),
  );

  mountOscillatorSelect(oscRoot, engine.state);
  mountAdsrControls(adsrRoot, engine.state);

  mountKeyboard(
    kbRoot,
    engine.state,
    engine.sampleRate,
    () => engine.resume(),
    () => true,
  );
}).catch((err) => {
  status.textContent = 'error: ' + err.message;
  console.error(err);
});
