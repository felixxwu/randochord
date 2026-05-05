// ============================================================================
//  src/ui/volume-control.ts — master volume slider
// ============================================================================
//
//  Single 0..100% slider scaling the engine's final mix. Like the ADSR
//  sliders, this is parameter STATE — engine reads once per render block.
// ============================================================================

import type { SharedState } from '../audio/shared-state';

const DEFAULT_PCT = 80;

export interface VolumeControlHandle {
  destroy(): void;
}

export function mountVolumeControl(
  root: HTMLElement,
  state: SharedState,
): VolumeControlHandle {
  root.innerHTML = `
    <div class="vol-control">
      <label for="vol">Vol</label>
      <input id="vol" type="range" min="0" max="100" value="${DEFAULT_PCT}" />
      <span id="vol-val">${DEFAULT_PCT}%</span>
    </div>
  `;

  state.setVolume(DEFAULT_PCT / 100);

  const input = root.querySelector<HTMLInputElement>('#vol')!;
  const val = root.querySelector<HTMLSpanElement>('#vol-val')!;
  const onInput = () => {
    const pct = parseInt(input.value, 10);
    state.setVolume(pct / 100);
    val.textContent = pct + '%';
  };
  input.addEventListener('input', onInput);

  return {
    destroy(): void {
      input.removeEventListener('input', onInput);
    },
  };
}
