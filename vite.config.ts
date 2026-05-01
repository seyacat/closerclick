import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/favicon.ico', 'images/logo.png'],
      manifest: {
        name: 'Closer Click',
        short_name: 'Closer Click',
        description: 'Ecosistema de aplicaciones cliente conectadas por proxy WebSocket',
        theme_color: '#2c3e50',
        background_color: '#1b2533',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'images/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      // Sin cache: el SW solo existe para que la app sea instalable como PWA.
      // No precachea ni hace runtime caching, todas las peticiones van a la red.
      workbox: {
        globPatterns: [],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [],
        navigateFallback: null
      }
    })
  ],
  base: './',
  build: {
    outDir: '../api/src/public',
    emptyOutDir: true,
  },
})
