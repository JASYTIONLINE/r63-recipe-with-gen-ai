import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` defaults to `/` — correct for Vercel (app served at domain root).
// GitHub Project Pages would need `base: '/repo-name/'` plus `BrowserRouter` basename.
export default defineConfig({
  plugins: [react()],
})
