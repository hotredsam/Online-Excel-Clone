import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const backendPort = process.env.VITE_API_PORT || process.env.PORT || '3001';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: `http://localhost:${backendPort}`, changeOrigin: true },
    },
  },
})
