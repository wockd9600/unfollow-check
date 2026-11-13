import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { localePageInputs, localePages } from './vite/locale-pages';

export default defineConfig({
  build: {
    rolldownOptions: { input: { ...localePageInputs } },
  },
  plugins: [
    localePages(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      // One manifest per language lives in public/ and is linked from each page's template.
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 40 } },
          },
        ],
      },
    }),
  ],
});
