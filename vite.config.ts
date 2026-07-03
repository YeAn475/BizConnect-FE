import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // sockjs-client references the Node global `global`, which doesn't exist in the browser.
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8301',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8301',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
