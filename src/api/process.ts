// 处理任务API
import { http } from './index'
import type { Process, ProcessSearchParams, PaginatedResponse } from './types'

/**
 * 获取处理任务列表
 */
export async function getProcesses(
  params: ProcessSearchParams,
): Promise<PaginatedResponse<Process>> {
  try {
    const response = await http.get<PaginatedResponse<Process>>('/api/v2/processes', {
      params: params,
    })
    return response
  } catch (error) {
    console.error('获取处理任务列表失败:', error)
    throw error
  }
}

/**
 * 创建处理任务
 */
export async function createProcess(params: Process): Promise<Process> {
  try {
    const response = await http.post<Process>('/api/v2/process', params)
    return response
  } catch (error) {
    console.error('创建处理任务失败:', error)
    throw error
  }
}

/**
 * 更新处理任务
 */
export async function updateProcess(id: number, params: Process): Promise<Process> {
  try {
    const response = await http.put<Process>(`/api/v2/process`, { id, ...params })
    return response
  } catch (error) {
    console.error(`更新处理任务 ${id} 失败:`, error)
    throw error
  }
}

export default {
  getProcesses,
  createProcess,
  updateProcess,
}
