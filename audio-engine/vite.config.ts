// ============================================================================
//  vite.config.ts — audio-engine, hosted at /audio-engine/ inside randochord
// ============================================================================
//
//  We are a child build inside the randochord repo. The randochord parent
//  builds its React SPA into `<repo>/dist/`. We build into
//  `<repo>/dist/audio-engine/`, so the deployed site serves the SPA at `/`
//  and this app at `/audio-engine/`.
//
//  Two Vite settings make this work:
//    - `base: '/audio-engine/'` — emitted asset URLs are prefixed correctly
//      (e.g. `/audio-engine/assets/index-XXXX.js` instead of `/assets/...`).
//    - `build.outDir: '../dist/audio-engine'` — output lands in the parent
//      project's dist directory.
//
//  The COOP/COEP headers below are dev-only. In production, Firebase Hosting
//  applies them via `firebase.json` headers scoped to /audio-engine/**. We
//  keep them here so that `npm run dev` (run from this folder) still gives
//  cross-origin isolation needed for SharedArrayBuffer.
// ============================================================================

import { defineConfig } from 'vite';

const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  base: '/audio-engine/',
  server: { headers: crossOriginIsolationHeaders },
  preview: { headers: crossOriginIsolationHeaders },
  build: {
    outDir: '../dist/audio-engine',
    emptyOutDir: true,
  },
});
