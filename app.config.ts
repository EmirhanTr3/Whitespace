import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    vite: {
        plugins: [
            tsConfigPaths({
                projects: ['./tsconfig.json'],
            })
        ],
    },
    server: {
        experimental: {
            websocket: true
        }
    }
}).then((config) =>
    config.addRouter({
        name: "websocket",
        type: "http",
        handler: "./app/lib/ws.ts",
        target: "server",
        base: "/_ws",
    })
)