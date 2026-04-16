import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { getApiConfig } from '@/utils/env'
import { ElMessage } from 'element-plus'

const apiConfig = getApiConfig()

const service = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const { data } = response

    if (data.code === 200 || data.success) {
      return data.data || data
    } else {
      console.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error: unknown) => {
    console.error('响应错误:', error)

    let err_info = '请求失败'
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 401:
          err_info = '未授权，请重新登录'
          break
        case 403:
          err_info = '拒绝访问'
          break
        case 404:
          err_info = '请求的资源不存在'
          break
        case 500:
          err_info = '服务器内部错误'
          break
        default:
          err_info = error.response.data?.message || '请求失败'
      }
    } else if (axios.isAxiosError(error) && !error.response) {
      err_info = '网络错误，请检查网络连接'
    }
    ElMessage({
      showClose: true,
      message: err_info,
      duration: 0,
      type: 'error',
    })

    return Promise.reject(error)
  },
)

export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

export default service
