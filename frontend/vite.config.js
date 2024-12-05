import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Ensure the output directory is set to 'build'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: remove "/api" from the forwarded path
      },
    },
  },
})