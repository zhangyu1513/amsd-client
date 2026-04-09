import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueJsx(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST || 'localhost',
      port: Number(env.VITE_DEV_SERVER_PORT) || 5173,
      open: false,
    },
    build: {
      minify: true,
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            'element-icons': ['@element-plus/icons-vue'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    envPrefix: 'VITE_',
  }
})
