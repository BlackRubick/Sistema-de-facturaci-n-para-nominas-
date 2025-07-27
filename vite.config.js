import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // Cambia a 3001
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})