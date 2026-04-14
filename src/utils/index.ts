// 工具函数集合
import dayjs from 'dayjs'
import { cloneDeep, debounce, throttle } from 'lodash-es'

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(date: string | Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 生成随机ID
 * @param length ID长度
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 */
export function deepClone<T>(obj: T): T {
  return cloneDeep(obj)
}

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param wait 等待时间
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  return debounce(fn, wait)
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param wait 等待时间
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  return throttle(fn, wait)
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * 验证手机号格式
 * @param phone 手机号
 */
export function validatePhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

/**
 * 下载文件
 * @param data 文件数据
 * @param filename 文件名
 * @param type 文件类型
 */
export function downloadFile(
  data: BlobPart,
  filename: string,
  type = 'application/octet-stream',
): void {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制失败:', err)

    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err2) {
      console.error('降级复制也失败:', err2)
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * 获取URL参数
 * @param name 参数名
 */
export function getUrlParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

/**
 * 设置URL参数
 * @param params 参数对象
 */
export function setUrlParams(params: Record<string, string | number | boolean>): void {
  const url = new URL(window.location.href)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })
  window.history.replaceState({}, '', url.toString())
}

/**
 * 生成颜色
 * @param str 字符串
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default {
  formatDate,
  formatFileSize,
  generateId,
  deepClone,
  useDebounce,
  useThrottle,
  validateEmail,
  validatePhone,
  downloadFile,
  copyToClipboard,
  getUrlParam,
  setUrlParams,
  stringToColor,
  sleep,
}
