import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const backendTarget = 'http://localhost:8080'

const proxyOptions = {
  target: backendTarget,
  changeOrigin: true,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/auth': proxyOptions,
      '/users': proxyOptions,
      '/analyses': proxyOptions,
      '/health': proxyOptions,
      '/swagger': proxyOptions,
    },
  },
})
