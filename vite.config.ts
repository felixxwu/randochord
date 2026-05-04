import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// In production, Firebase Hosting serves the built audio-engine app at
// /audio-engine/. In dev, the audio-engine sub-app has its OWN Vite dev
// server (run `cd audio-engine && npm run dev`) — it can't share
// randochord's, because the two projects have different tsconfig targets,
// different asset pipelines (audio-engine builds wasm), and different
// base URLs.
//
// Without this guard, hitting /audio-engine/* on randochord's dev server
// causes Vite to try to transform audio-engine's TS through randochord's
// pipeline, fail to resolve audio-engine/package.json as a package, and
// throw a confusing "Failed to resolve entry for package" error.
//
// This middleware intercepts /audio-engine/* requests early and returns a
// 404 with a helpful message instead.
const blockAudioEngineInDev: Plugin = {
    name: 'block-audio-engine-in-dev',
    apply: 'serve',
    configureServer(server) {
        // Prepending to the middleware stack ensures we run BEFORE Vite's
        // own transform middleware, which is what would otherwise crash.
        return () => {
            const stack = server.middlewares.stack as Array<{
                route: string
                handle: (req: any, res: any, next: any) => void
            }>
            stack.unshift({
                route: '',
                handle(req, res, next) {
                    if (req.url?.startsWith('/audio-engine')) {
                        res.statusCode = 404
                        res.setHeader(
                            'Content-Type',
                            'text/plain; charset=utf-8',
                        )
                        res.end(
                            'audio-engine has its own dev server.\n' +
                                'Run `cd audio-engine && npm run dev` to develop it.\n' +
                                'In production (after `npm run build` + `firebase deploy`),\n' +
                                'this URL serves the built audio-engine app.\n',
                        )
                        return
                    }
                    next()
                },
            })
        }
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), blockAudioEngineInDev],
    publicDir: 'public',
})
