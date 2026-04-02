/// <reference types="vite/client" />

/**
 * Vite 环境变量类型定义
 * 注意：所有环境变量在导入时都是字符串类型
 * 需要在代码中进行适当的类型转换
 */
interface ImportMetaEnv {
  // 基础配置
  readonly VITE_APP_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  
  // 服务器配置
  readonly VITE_DEV_SERVER_HOST: string
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HTTPS: string
  readonly VITE_DEV_SERVER_OPEN: string
  readonly VITE_DEV_SERVER_CORS: string
  
  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_MAX_RETRIES: string
  
  // 功能开关
  readonly VITE_MOCK_ENABLED: string
  readonly VITE_DEBUG: string
  readonly VITE_FEATURE_AUTH: string
  readonly VITE_FEATURE_MOCK: string
  readonly VITE_FEATURE_HOT_RELOAD: string
  
  // 日志配置
  readonly VITE_LOG_LEVEL: string
  readonly VITE_LOG_CONSOLE_ENABLED: string
  readonly VITE_LOG_NETWORK_ENABLED: string
  
  // 开发工具
  readonly VITE_VUE_DEVTOOLS_ENABLED: string
  readonly VITE_PERFORMANCE_MONITOR_ENABLED: string
  
  // 缓存配置
  readonly VITE_CACHE_ENABLED: string
  readonly VITE_CACHE_TTL: string
  
  // 性能优化
  readonly VITE_COMPRESSION_ENABLED: string
  readonly VITE_MINIFY_ENABLED: string
  readonly VITE_SOURCEMAP_ENABLED: string
  
  // 安全配置
  readonly VITE_CORS_ENABLED: string
  readonly VITE_CSRF_ENABLED: string
  readonly VITE_CSP_ENABLED: string
  readonly VITE_HSTS_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
