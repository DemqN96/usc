import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

/* Multi-page site: `/` (title page), `/krany/` (USC ball valves) and `/prote/`
 * (PROTE partner page). Each page is its own HTML entry; shared code is split
 * into common chunks by the bundler. */
const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        krany: page('./krany/index.html'),
        prote: page('./prote/index.html'),
      },
    },
  },
})
