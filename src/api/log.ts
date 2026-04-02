// 日志管理API
import { http } from './index'
import type { PaginationParams, PaginatedResponse, Process, Fracture } from './types'

/**
 * 获取系统日志列表
 */
// export async function getSystemLogs(params?: PaginationParams): Promise<PaginatedResponse<any>> {
//   try {
//     const response = await http.get<PaginatedResponse<any>>('/api/logs', { params })
//     return response
//   } catch (error) {
//     console.error('获取系统日志列表失败:', error)
//     throw error
//   }
// }

/**
 * 获取处理任务日志
 */
export async function getProcessLog(params: Process): Promise<Process> {
  try {
    const response = await http.get<Process>('/api/v2/process/log', {
      params: params,
    })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 获取断裂分析日志
 */
export async function getFractureLog(params: Fracture): Promise<Fracture> {
  try {
    const response = await http.get<Fracture>('/api/v2/fracture/log', {
      params: params,
    })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 获取密度分析日志
 */
// export async function getDensityLogs(
//   densityId: number,
//   params?: PaginationParams,
// ): Promise<PaginatedResponse<DensityLog>> {
//   try {
//     const response = await http.get<PaginatedResponse<DensityLog>>('/api/v2/density/log', {
//       params: { densityId, ...params },
//     })
//     return response
//   } catch (error) {
//     console.error(`获取密度分析 ${densityId} 日志失败:`, error)
//     throw error
//   }
// }

/**
 * 搜索日志
 */
export async function searchLogs(
  params: PaginationParams & {
    keyword?: string
    level?: string
    source?: string
    startTime?: string
    endTime?: string
  },
): Promise<PaginatedResponse<any>> {
  try {
    const response = await http.get<PaginatedResponse<any>>('/api/logs/search', { params })
    return response
  } catch (error) {
    console.error('搜索日志失败:', error)
    throw error
  }
}

/**
 * 导出日志
 */
export async function exportLogs(params: {
  startTime?: string
  endTime?: string
  level?: string
  source?: string
}): Promise<Blob> {
  try {
    const response = await http.post<Blob>('/api/logs/export', params, {
      responseType: 'blob',
    })
    return response
  } catch (error) {
    console.error('导出日志失败:', error)
    throw error
  }
}

/**
 * 清理日志
 */
export async function clearLogs(params: {
  beforeTime?: string
  level?: string
  source?: string
}): Promise<{ deletedCount: number }> {
  try {
    const response = await http.post<{ deletedCount: number }>('/api/logs/clear', params)
    return response
  } catch (error) {
    console.error('清理日志失败:', error)
    throw error
  }
}

/**
 * 获取日志统计信息
 */
// export async function getLogStats(params?: { startTime?: string; endTime?: string }): Promise<{
//   total: number
//   byLevel: Record<string, number>
//   bySource: Record<string, number>
//   byHour: Record<string, number>
// }> {
//   try {
//     const logs = await getSystemLogs({ Page: 1, PageSize: 1000, ...params })

//     const byLevel: Record<string, number> = {}
//     const bySource: Record<string, number> = {}
//     const byHour: Record<string, number> = {}

//     logs.List.forEach((log: any) => {
//       byLevel[log.level] = (byLevel[log.level] || 0) + 1
//       bySource[log.source] = (bySource[log.source] || 0) + 1

//       if (log.timestamp) {
//         const hour = new Date(log.timestamp).getHours()
//         byHour[hour.toString()] = (byHour[hour.toString()] || 0) + 1
//       }
//     })

//     return {
//       total: logs.Total,
//       byLevel,
//       bySource,
//       byHour,
//     }
//   } catch (error) {
//     console.error('获取日志统计信息失败:', error)
//     throw error
//   }
// }

export default {
  // getSystemLogs,
  getProcessLog,
  getFractureLog,
  // getDensityLogs,
  searchLogs,
  exportLogs,
  clearLogs,
  // getLogStats,
}
