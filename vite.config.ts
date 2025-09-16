import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Determine base path based on environment
// DEPLOY_ENV=github -> GitHub Pages
const isGitHubPages = process.env.DEPLOY_ENV === 'github';
const basePath = isGitHubPages ? '/FineTrack/' : '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'logo_image.png'],
      manifest: {
        name: 'FineTrack - Vehicle Fine & Expense Tracker',
        short_name: 'FineTrack',
        description: 'Track vehicle fines, charges, MOT, insurance and more in one place',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: basePath,
        start_url: basePath,
        icons: [
          { src: `${basePath}pwa-192x192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${basePath}pwa-512x512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${basePath}pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': { 
        target: 'http://localhost:3001', 
        changeOrigin: true, 
        secure: false 
      }
    }
  }
});
