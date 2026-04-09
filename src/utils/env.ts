interface ApiConfig {
  baseUrl: string
  timeout: number
  maxRetries: number
}

interface AppConfig {
  name: string
  version: string
}

interface DevServerConfig {
  host: string
  port: number
}

function toNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue
  const num = parseInt(value, 10)
  return isNaN(num) ? defaultValue : num
}

export function getApiConfig(): ApiConfig {
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 30000),
    maxRetries: toNumber(import.meta.env.VITE_API_MAX_RETRIES, 3),
  }
}

export function getAppConfig(): AppConfig {
  return {
    name: import.meta.env.VITE_APP_NAME || 'AMSD Client',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
}

export function getDevServerConfig(): DevServerConfig {
  return {
    host: import.meta.env.VITE_DEV_SERVER_HOST || 'localhost',
    port: toNumber(import.meta.env.VITE_DEV_SERVER_PORT, 5173),
  }
}

export function isMockEnabled(): boolean {
  return import.meta.env.VITE_MOCK_ENABLED === 'true'
}

export default {
  getApiConfig,
  getAppConfig,
  getDevServerConfig,
  isMockEnabled,
}
