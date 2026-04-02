import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { setCustomEnv, getDevServerConfig, getFeatureFlags, getLogConfig, getPerformanceConfig } from './src/utils/env'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 设置自定义环境变量供 env.ts 使用
  setCustomEnv(env)
  
  // 使用 env.ts 获取配置
  const devServerConfig = getDevServerConfig()
  const featureFlags = getFeatureFlags()
  const logConfig = getLogConfig()
  const performanceConfig = getPerformanceConfig()
  
  // 解析端口号，支持环境变量覆盖
  const port = devServerConfig.port
  const host = devServerConfig.host
  const https = devServerConfig.https
  const open = devServerConfig.open
  const cors = devServerConfig.cors
  
  // 开发工具配置
  const vueDevToolsEnabled = featureFlags.vueDevTools
  
  // Mock 配置
  const mockEnabled = featureFlags.mockEnabled && mode === 'development'
  const featureMockEnabled = featureFlags.mockFeature

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevToolsEnabled && vueDevTools(),
      tailwindcss(),
      (mockEnabled && featureMockEnabled) && viteMockServe({
        mockPath: 'mock',
        enable: true,
        watchFiles: true,
        logger: logConfig.level === 'debug',
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host,
      port,
      https: https ? {} : undefined,
      open,
      cors,
      // 热重载配置
      hmr: featureFlags.hotReload,
    },
    build: {
      // 生产环境优化
      minify: performanceConfig.minify,
      sourcemap: performanceConfig.sourcemap,
      // 代码分割配置
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            'element-icons': ['@element-plus/icons-vue'],
          },
        },
      },
      // 块大小警告限制
      chunkSizeWarningLimit: 1000,
    },
    // 环境变量前缀
    envPrefix: 'VITE_',
  }
})