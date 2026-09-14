import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /* GitHub Pages serves project pages from /<repo>/, not the domain root. */
  base: '/usc/',
  plugins: [react()],
})
