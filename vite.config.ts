import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Pokelinger-Eskalari/', // Base URL for github pages
  server: {
    host: true, // Exposes on all network interfaces
    port: 3000,
  },
})
