import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'], // Ensure cal.png is in public/
      manifest: {
        name: "Rajarshi's Code Schedule - Task Calendar",
        short_name: "Task Calendar",
        start_url: ".",
        display: "standalone",
        background_color: "#121212",
        theme_color: "#121212",
        icons: [
          {
            src: "icon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
