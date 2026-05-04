// ============================================================================
//  src/ui/adsr-controls.ts — global ADSR envelope controls
// ============================================================================
//
//  Four sliders controlling the per-voice envelope:
//    A — attack time      (1..500 ms, linear)
//    D — decay time       (1..2000 ms, linear)
//    S — sustain level    (0..1, shown as %)
//    R — release time     (1..3000 ms, linear)
//
//  Writes go straight into shared memory via SharedState. The engine reads
//  once per render block, so changes are heard within ~2.7 ms — fast enough
//  to feel real-time even when twiddling sliders during playback.
//
//  No event-bus involvement: ADSR is parameter state, not events. (A real
//  DAW would queue PARAM_CHANGE events here so automation curves could
//  drive the envelope sample-accurately. For an MVP this is fine.)
// ============================================================================

import type { SharedState } from '../audio/shared-state';

const DEFAULTS = {
  attackMs: 5,
  decayMs:  60,
  sustain:  0.7,    // 0..1
  releaseMs: 120,
};

export interface AdsrHandle {
  destroy(): void;
}

export function mountAdsrControls(
  root: HTMLElement,
  state: SharedState,
): AdsrHandle {
  root.innerHTML = `
    <div class="adsr">
      <div class="slider">
        <label for="adsr-a">Attack</label>
        <input id="adsr-a" type="range" min="1" max="500" value="${DEFAULTS.attackMs}" />
        <span id="adsr-a-val">${DEFAULTS.attackMs} ms</span>
      </div>
      <div class="slider">
        <label for="adsr-d">Decay</label>
        <input id="adsr-d" type="range" min="1" max="2000" value="${DEFAULTS.decayMs}" />
        <span id="adsr-d-val">${DEFAULTS.decayMs} ms</span>
      </div>
      <div class="slider">
        <label for="adsr-s">Sustain</label>
        <input id="adsr-s" type="range" min="0" max="100" value="${Math.round(DEFAULTS.sustain * 100)}" />
        <span id="adsr-s-val">${Math.round(DEFAULTS.sustain * 100)}%</span>
      </div>
      <div class="slider">
        <label for="adsr-r">Release</label>
        <input id="adsr-r" type="range" min="1" max="3000" value="${DEFAULTS.releaseMs}" />
        <span id="adsr-r-val">${DEFAULTS.releaseMs} ms</span>
      </div>
    </div>
  `;

  const aInput = root.querySelector<HTMLInputElement>('#adsr-a')!;
  const dInput = root.querySelector<HTMLInputElement>('#adsr-d')!;
  const sInput = root.querySelector<HTMLInputElement>('#adsr-s')!;
  const rInput = root.querySelector<HTMLInputElement>('#adsr-r')!;
  const aVal = root.querySelector<HTMLSpanElement>('#adsr-a-val')!;
  const dVal = root.querySelector<HTMLSpanElement>('#adsr-d-val')!;
  const sVal = root.querySelector<HTMLSpanElement>('#adsr-s-val')!;
  const rVal = root.querySelector<HTMLSpanElement>('#adsr-r-val')!;

  // Push defaults into shared memory so the engine has sensible values
  // before the user touches anything.
  state.setAttackMs(DEFAULTS.attackMs);
  state.setDecayMs(DEFAULTS.decayMs);
  state.setSustain(DEFAULTS.sustain);
  state.setReleaseMs(DEFAULTS.releaseMs);

  const onA = () => {
    const v = parseInt(aInput.value, 10);
    state.setAttackMs(v);
    aVal.textContent = v + ' ms';
  };
  const onD = () => {
    const v = parseInt(dInput.value, 10);
    state.setDecayMs(v);
    dVal.textContent = v + ' ms';
  };
  const onS = () => {
    const pct = parseInt(sInput.value, 10);
    state.setSustain(pct / 100);
    sVal.textContent = pct + '%';
  };
  const onR = () => {
    const v = parseInt(rInput.value, 10);
    state.setReleaseMs(v);
    rVal.textContent = v + ' ms';
  };

  aInput.addEventListener('input', onA);
  dInput.addEventListener('input', onD);
  sInput.addEventListener('input', onS);
  rInput.addEventListener('input', onR);

  return {
    destroy(): void {
      aInput.removeEventListener('input', onA);
      dInput.removeEventListener('input', onD);
      sInput.removeEventListener('input', onS);
      rInput.removeEventListener('input', onR);
    },
  };
}
