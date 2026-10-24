import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'Science in Realworld: Periodic Table',
        short_name: 'ScienceTable',
        description: 'Interactive periodic table paired with real-world applications. B2B enterprise & school group licensing, Bohr atom visualizer, and offline access.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        categories: ['education', 'science', 'productivity'],
        shortcuts: [
          {
            name: 'Periodic Table',
            short_name: 'Table',
            description: 'View full interactive periodic table',
            url: '/?tab=table'
          },
          {
            name: 'Flashcard Browse',
            short_name: 'Browse',
            description: 'Learn elements one-by-one',
            url: '/?tab=browse'
          },
          {
            name: 'Chemistry Quiz',
            short_name: 'Quiz',
            description: 'Test your element knowledge',
            url: '/?tab=quiz'
          },
          {
            name: 'School / B2B License',
            short_name: 'Licenses',
            description: 'Activate or manage institution licenses',
            url: '/?tab=licenses'
          }
        ],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
