// ============================================================================
//  src/ui/oscillator-select.ts — global oscillator-waveform picker
// ============================================================================
//
//  Single <select> mapped to OSC_* constants. Like the ADSR sliders, this is
//  parameter STATE — engine reads once per render block, no events involved.
// ============================================================================

import {
  OSC_SQUARE,
  OSC_SAW,
  OSC_TRIANGLE,
  OSC_SINE,
} from '../audio/shared-state';
import type { SharedState } from '../audio/shared-state';

const DEFAULT = OSC_SQUARE;

const OPTIONS = [
  { value: OSC_SQUARE,   label: 'Square'   },
  { value: OSC_SAW,      label: 'Sawtooth' },
  { value: OSC_TRIANGLE, label: 'Triangle' },
  { value: OSC_SINE,     label: 'Sine'     },
];

export interface OscillatorSelectHandle {
  destroy(): void;
}

export function mountOscillatorSelect(
  root: HTMLElement,
  state: SharedState,
): OscillatorSelectHandle {
  root.innerHTML = `
    <div class="osc-select">
      <label for="osc">Oscillator</label>
      <select id="osc">
        ${OPTIONS.map((o) => `<option value="${o.value}"${o.value === DEFAULT ? ' selected' : ''}>${o.label}</option>`).join('')}
      </select>
    </div>
  `;

  state.setOscillator(DEFAULT);

  const sel = root.querySelector<HTMLSelectElement>('#osc')!;
  const onChange = () => {
    state.setOscillator(parseInt(sel.value, 10));
  };
  sel.addEventListener('change', onChange);

  return {
    destroy(): void {
      sel.removeEventListener('change', onChange);
    },
  };
}
