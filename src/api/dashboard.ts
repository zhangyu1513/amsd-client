// 仪表盘API
import { http } from './index'

// 统计数据
export interface DashboardStats {
  totalSuits: number
  totalOrders: number
  totalProcesses: number
  activeTasks: number
  todayNewSuits: number
  todayNewOrders: number
  successRate: number
  avgProcessTime: number
}

// 任务趋势数据
export interface TaskTrendData {
  date: string
  suits: number
  orders: number
  processes: number
}

// 任务分布数据
export interface TaskDistributionData {
  name: string
  value: number
}

// 性能指标
export interface PerformanceMetrics {
  responseTime: number
  uptime: number
  errorRate: number
  throughput: number
}

/**
 * 获取仪表盘统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await http.get<DashboardStats>('/api/dashboard/stats')
    return response
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error)
    throw error
  }
}

/**
 * 获取任务趋势数据
 */
export async function getTaskTrendData(params?: {
  days?: number
  startDate?: string
  endDate?: string
}): Promise<TaskTrendData[]> {
  try {
    const response = await http.get<TaskTrendData[]>('/api/dashboard/chart/task-trend', { params })
    return response
  } catch (error) {
    console.error('获取任务趋势数据失败:', error)
    throw error
  }
}

/**
 * 获取任务分布数据
 */
export async function getTaskDistributionData(): Promise<TaskDistributionData[]> {
  try {
    const response = await http.get<TaskDistributionData[]>('/api/dashboard/chart/task-distribution')
    return response
  } catch (error) {
    console.error('获取任务分布数据失败:', error)
    throw error
  }
}

/**
 * 获取性能指标
 */
export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  try {
    const response = await http.get<PerformanceMetrics>('/api/dashboard/performance')
    return response
  } catch (error) {
    console.error('获取性能指标失败:', error)
    throw error
  }
}

/**
 * 获取实时活动数据
 */
export async function getRealtimeActivities(params?: {
  limit?: number
}): Promise<Array<{
  id: number
  type: string
  title: string
  description: string
  timestamp: string
  user: string
}>> {
  try {
    const response = await http.get<Array<{
      id: number
      type: string
      title: string
      description: string
      timestamp: string
      user: string
    }>>('/api/dashboard/realtime-activities', { params })
    return response
  } catch (error) {
    console.error('获取实时活动数据失败:', error)
    throw error
  }
}

/**
 * 获取资源使用情况
 */
export async function getResourceUsage(): Promise<{
  cpu: number
  memory: number
  disk: number
  network: number
}> {
  try {
    const response = await http.get<{
      cpu: number
      memory: number
      disk: number
      network: number
    }>('/api/dashboard/resource-usage')
    return response
  } catch (error) {
    console.error('获取资源使用情况失败:', error)
    throw error
  }
}

/**
 * 获取业务指标
 */
export async function getBusinessMetrics(params?: {
  startDate?: string
  endDate?: string
}): Promise<{
  revenue: number
  cost: number
  profit: number
  efficiency: number
  customerSatisfaction: number
}> {
  try {
    const response = await http.get<{
      revenue: number
      cost: number
      profit: number
      efficiency: number
      customerSatisfaction: number
    }>('/api/dashboard/business-metrics', { params })
    return response
  } catch (error) {
    console.error('获取业务指标失败:', error)
    throw error
  }
}

/**
 * 获取预警信息
 */
export async function getAlerts(params?: {
  level?: string
  status?: string
  limit?: number
}): Promise<Array<{
  id: number
  level: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  timestamp: string
  status: 'new' | 'acknowledged' | 'resolved'
  source: string
}>> {
  try {
    const response = await http.get<Array<{
      id: number
      level: 'info' | 'warning' | 'error' | 'critical'
      title: string
      message: string
      timestamp: string
      status: 'new' | 'acknowledged' | 'resolved'
      source: string
    }>>('/api/dashboard/alerts', { params })
    return response
  } catch (error) {
    console.error('获取预警信息失败:', error)
    throw error
  }
}

/**
 * 获取仪表盘配置
 */
export async function getDashboardConfig(): Promise<{
  widgets: Array<{
    id: string
    type: string
    title: string
    position: { x: number; y: number; w: number; h: number }
    config: Record<string, any>
  }>
  layout: string
  theme: string
}> {
  try {
    const response = await http.get<{
      widgets: Array<{
        id: string
        type: string
        title: string
        position: { x: number; y: number; w: number; h: number }
        config: Record<string, any>
      }>
      layout: string
      theme: string
    }>('/api/dashboard/config')
    return response
  } catch (error) {
    console.error('获取仪表盘配置失败:', error)
    throw error
  }
}

/**
 * 更新仪表盘配置
 */
export async function updateDashboardConfig(config: {
  widgets?: Array<{
    id: string
    type: string
    title: string
    position: { x: number; y: number; w: number; h: number }
    config: Record<string, any>
  }>
  layout?: string
  theme?: string
}): Promise<void> {
  try {
    await http.put('/api/dashboard/config', config)
  } catch (error) {
    console.error('更新仪表盘配置失败:', error)
    throw error
  }
}

export default {
  getDashboardStats,
  getTaskTrendData,
  getTaskDistributionData,
  getPerformanceMetrics,
  getRealtimeActivities,
  getResourceUsage,
  getBusinessMetrics,
  getAlerts,
  getDashboardConfig,
  updateDashboardConfig
}