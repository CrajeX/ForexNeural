
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    

    port: 5174,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      '@theme': './themeConfig.js'
    }
  }
})
