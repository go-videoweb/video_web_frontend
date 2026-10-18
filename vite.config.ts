import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    define: { __DEMO_BUILD__: JSON.stringify(mode === 'demo') },
    server: {
      proxy: {
        '/api': { target: env.API_PROXY_TARGET || 'http://127.0.0.1:8001', changeOrigin: true },
      },
    },
    build: { chunkSizeWarningLimit: 700 },
  }
})
