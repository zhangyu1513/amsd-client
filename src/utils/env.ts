/**
 * 环境变量工具类
 * 提供类型安全的环境变量访问
 * 注意：所有环境变量在导入时都是字符串类型，这里进行适当的类型转换
 * 
 * 使用方式：
 * 1. 在 Node.js 环境（如 vite.config.ts）中，先调用 setCustomEnv() 设置环境变量
 * 2. 在浏览器环境中，直接使用 import.meta.env
 */

// 类型定义
interface AppConfig {
  name: string
  title: string
  version: string
}

interface ApiConfig {
  baseUrl: string
  timeout: number
  maxRetries: number
}

interface DevServerConfig {
  host: string
  port: number
  https: boolean
  open: boolean
  cors: boolean
}

interface FeatureFlags {
  mockEnabled: boolean
  debugEnabled: boolean
  authEnabled: boolean
  mockFeature: boolean
  hotReload: boolean
  vueDevTools: boolean
}

interface LogConfig {
  level: string
  consoleEnabled: boolean
  networkEnabled: boolean
}

interface CacheConfig {
  enabled: boolean
  ttl: number
}

interface PerformanceConfig {
  compression: boolean
  minify: boolean
  sourcemap: boolean
}

interface SecurityConfig {
  cors: boolean
  csrf: boolean
  csp: boolean
  hsts: boolean
}

interface EnvironmentInfo {
  isDevelopment: boolean
  isProduction: boolean
  mode: string
}

interface EnvConfig {
  app: AppConfig
  api: ApiConfig
  devServer: DevServerConfig
  features: FeatureFlags
  log: LogConfig
  cache: CacheConfig
  performance: PerformanceConfig
  security: SecurityConfig
  environment: EnvironmentInfo
}

// 工具函数：安全地转换布尔值
function toBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (value === undefined || value === '') return defaultValue
  return value.toLowerCase() === 'true'
}

// 工具函数：安全地转换数字
function toNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === '') return defaultValue
  const num = parseInt(value, 10)
  return isNaN(num) ? defaultValue : num
}

// 环境变量存储
let customEnv: Record<string, string> | null = null

/**
 * 设置自定义环境变量（用于 Node.js 环境）
 * 在 vite.config.ts 中调用此函数，传入 loadEnv() 加载的环境变量
 */
export function setCustomEnv(env: Record<string, string>): void {
  customEnv = env
}

/**
 * 获取环境变量值
 * 优先使用自定义环境变量，否则使用 import.meta.env（仅在浏览器环境中）
 */
function getEnvVar(key: string): string | undefined {
  // 优先使用自定义环境变量
  if (customEnv && customEnv[key] !== undefined) {
    return customEnv[key]
  }
  
  // 如果没有自定义环境变量，尝试使用 import.meta.env（仅在浏览器环境中）
  // 使用 try-catch 避免在 Node.js 环境中出错
  try {
    // 这个代码只在浏览器环境中执行
    // 在构建时，TypeScript 会检查这个代码，但不会执行
    // 我们使用条件编译注释来告诉 TypeScript 这是安全的
    // @ts-ignore
    if (import.meta && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key]
    }
  } catch (e) {
    // 在 Node.js 环境中，import.meta 可能不可用
    // 忽略错误，返回 undefined
  }
  
  return undefined
}

/**
 * 获取应用配置
 */
export function getAppConfig(): AppConfig {
  return {
    name: getEnvVar('VITE_APP_NAME') || 'AMSD Client',
    title: getEnvVar('VITE_APP_TITLE') || 'AMSD Client',
    version: getEnvVar('VITE_APP_VERSION') || '1.0.0',
  }
}

/**
 * 获取API配置
 */
export function getApiConfig(): ApiConfig {
  return {
    baseUrl: getEnvVar('VITE_API_BASE_URL') || '/api',
    timeout: toNumber(getEnvVar('VITE_API_TIMEOUT'), 30000),
    maxRetries: toNumber(getEnvVar('VITE_API_MAX_RETRIES'), 3),
  }
}

/**
 * 获取开发服务器配置
 */
export function getDevServerConfig(): DevServerConfig {
  return {
    host: getEnvVar('VITE_DEV_SERVER_HOST') || 'localhost',
    port: toNumber(getEnvVar('VITE_DEV_SERVER_PORT'), 5173),
    https: toBoolean(getEnvVar('VITE_DEV_SERVER_HTTPS'), false),
    open: toBoolean(getEnvVar('VITE_DEV_SERVER_OPEN'), true),
    cors: toBoolean(getEnvVar('VITE_DEV_SERVER_CORS'), true),
  }
}

/**
 * 获取功能开关配置
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    mockEnabled: toBoolean(getEnvVar('VITE_MOCK_ENABLED'), false),
    debugEnabled: toBoolean(getEnvVar('VITE_DEBUG'), false),
    authEnabled: toBoolean(getEnvVar('VITE_FEATURE_AUTH'), true),
    mockFeature: toBoolean(getEnvVar('VITE_FEATURE_MOCK'), false),
    hotReload: toBoolean(getEnvVar('VITE_FEATURE_HOT_RELOAD'), true),
    vueDevTools: toBoolean(getEnvVar('VITE_VUE_DEVTOOLS_ENABLED'), true),
  }
}

/**
 * 获取日志配置
 */
export function getLogConfig(): LogConfig {
  return {
    level: getEnvVar('VITE_LOG_LEVEL') || 'info',
    consoleEnabled: toBoolean(getEnvVar('VITE_LOG_CONSOLE_ENABLED'), true),
    networkEnabled: toBoolean(getEnvVar('VITE_LOG_NETWORK_ENABLED'), false),
  }
}

/**
 * 获取缓存配置
 */
export function getCacheConfig(): CacheConfig {
  return {
    enabled: toBoolean(getEnvVar('VITE_CACHE_ENABLED'), false),
    ttl: toNumber(getEnvVar('VITE_CACHE_TTL'), 300000),
  }
}

/**
 * 获取性能配置
 */
export function getPerformanceConfig(): PerformanceConfig {
  return {
    compression: toBoolean(getEnvVar('VITE_COMPRESSION_ENABLED'), true),
    minify: toBoolean(getEnvVar('VITE_MINIFY_ENABLED'), true),
    sourcemap: toBoolean(getEnvVar('VITE_SOURCEMAP_ENABLED'), false),
  }
}

/**
 * 获取安全配置
 */
export function getSecurityConfig(): SecurityConfig {
  return {
    cors: toBoolean(getEnvVar('VITE_CORS_ENABLED'), true),
    csrf: toBoolean(getEnvVar('VITE_CSRF_ENABLED'), true),
    csp: toBoolean(getEnvVar('VITE_CSP_ENABLED'), true),
    hsts: toBoolean(getEnvVar('VITE_HSTS_ENABLED'), true),
  }
}

/**
 * 检查当前环境
 */
export function getEnvironment(): EnvironmentInfo {
  // 如果有自定义环境变量，使用其中的 NODE_ENV
  const nodeEnv = getEnvVar('NODE_ENV') || getEnvVar('MODE') || 'development'
  
  return {
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    mode: nodeEnv,
  }
}

/**
 * 获取完整的环境配置
 */
export function getEnvConfig(): EnvConfig {
  return {
    app: getAppConfig(),
    api: getApiConfig(),
    devServer: getDevServerConfig(),
    features: getFeatureFlags(),
    log: getLogConfig(),
    cache: getCacheConfig(),
    performance: getPerformanceConfig(),
    security: getSecurityConfig(),
    environment: getEnvironment(),
  }
}

/**
 * 打印环境配置（仅开发环境）
 */
export function logEnvConfig(): void {
  const config = getEnvConfig()
  const env = getEnvironment()
  
  if (env.isDevelopment) {
    console.group('🌍 环境配置')
    console.log('应用配置:', config.app)
    console.log('API配置:', config.api)
    console.log('开发服务器:', config.devServer)
    console.log('功能开关:', config.features)
    console.log('日志配置:', config.log)
    console.log('环境信息:', config.environment)
    console.groupEnd()
  }
}

// 默认导出完整配置
export default getEnvConfig()