// API 统一入口
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getApiConfig } from '@/utils/env'
import type {
  Suit,
  SuitSearchParams,
  Order,
  Process,
  ProcessSearchParams,
  OrderSearchParams,
  Fracture,
  FractureSearchParams,
  DensitySearchParams,
  Density,
} from './types'

// 使用 env.ts 获取 API 配置
const apiConfig = getApiConfig()

// API配置 - 使用 env.ts 中的配置
const API_CONFIG = {
  // 使用 env.ts 中的 baseURL 配置
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在这里可以添加 token 等
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 根据后端返回的数据结构进行调整
    if (data.code === 200 || data.success) {
      return data.data || data
    } else {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error: any) => {
    console.error('响应错误:', error)

    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          // 跳转到登录页
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

// 导出常用的请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

// 导出原始的 axios 实例
export default service

// 导出所有API模块
export * from './types'
// export * from './auth'
// export * from './suit'
// export * from './order'
// export * from './process'
// export * from './fracture'
// export * from './density'
// export * from './log'
// export * from './dashboard'

// 统一API对象 - 从各个模块导入具体实现
export const api = {
  auth: {
    login: async (params: any) => {
      const authModule = await import('./auth')
      return authModule.default.login(params)
    },
    logout: async () => {
      const authModule = await import('./auth')
      return authModule.default.logout()
    },
    getUserInfo: async () => {
      const authModule = await import('./auth')
      return authModule.default.getUserInfo()
    },
    updateUserInfo: async (params: any) => {
      const authModule = await import('./auth')
      return authModule.default.updateUserInfo(params)
    },
  },
  suit: {
    getSuits: async (params: SuitSearchParams) => {
      const suitModule = await import('./suit')
      return suitModule.default.getSuits(params)
    },
    getSuit: async (params: Suit) => {
      const suitModule = await import('./suit')
      return suitModule.default.getSuit(params)
    },
  },
  order: {
    getOrders: async (params: OrderSearchParams) => {
      const orderModule = await import('./order')
      return orderModule.default.getOrders(params)
    },
    getOrder: async (id: number) => {
      const orderModule = await import('./order')
      return orderModule.default.getOrder(id)
    },
  },
  process: {
    getProcess: async (params: Process) => {
      const processModule = await import('./process')
      return processModule.default.getProcess(params)
    },
    getProcesses: async (params: ProcessSearchParams) => {
      const processModule = await import('./process')
      return processModule.default.getProcesses(params)
    },
    createProcess: async (params: Process) => {
      const processModule = await import('./process')
      return processModule.default.createProcess(params)
    },
  },
  fracture: {
    getFractures: async (params: FractureSearchParams) => {
      const fractureModule = await import('./fracture')
      return fractureModule.default.getFractures(params)
    },
    createFracture: async (params: Fracture) => {
      const fractureModule = await import('./fracture')
      return fractureModule.default.createFracture(params)
    },
  },
  density: {
    getDensities: async (params: DensitySearchParams) => {
      const densityModule = await import('./density')
      return densityModule.default.getDensities(params)
    },
    createDensity: async (params: Density) => {
      const densityModule = await import('./density')
      return densityModule.default.createDensity(params)
    },
  },
  log: {
    getProcessLogs: async (params: Process) => {
      const logModule = await import('./log')
      return logModule.default.getProcessLog(params)
    },
    getFractureLogs: async (params: Fracture) => {
      const logModule = await import('./log')
      return logModule.default.getFractureLog(params)
    },
    // getDensityLogs: async (densityId: number, params?: any) => {
    //   const logModule = await import('./log')
    //   return logModule.default.getDensityLogs(densityId, params)
    // },
  },
  dashboard: {
    getDashboardStats: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getDashboardStats()
    },
    getTaskTrendData: async (params?: any) => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getTaskTrendData(params)
    },
    getTaskDistributionData: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getTaskDistributionData()
    },
  },
}
