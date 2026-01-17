import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-96x96.png', 'apple-touch-icon.png', 'logo.svg'],
      manifest: {
        name: 'Pokelinger Eskalari',
        short_name: 'Eskalari',
        description: 'Das digitale Scorebook für Eskalero',
        theme_color: '#1b171b',
        background_color: '#1b171b',
        display: 'standalone',
        lang: 'de_AT',
        icons: [
          {
            src: "pwa-192x192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-192x192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      },
    }),
  ],
  base: '/Pokelinger-Eskalari/', // Base URL for github pages
  server: {
    host: true, // Exposes on all network interfaces
    port: 3000,
  },
})
