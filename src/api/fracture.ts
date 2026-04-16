// 断裂分析API
import { fract } from 'three/src/nodes/math/MathNode.js'
import { http } from './http'
import type { Fracture, FractureSearchParams, PaginatedResponse } from './types'

/**
 * 获取断裂分析列表
 */
export async function getFractures(
  params: FractureSearchParams,
): Promise<PaginatedResponse<Fracture>> {
  try {
    const response = await http.get<PaginatedResponse<Fracture>>('/api/v2/fractures', {
      params: params,
    })
    return response
  } catch (error) {
    console.error('获取断裂分析列表失败:', error)
    throw error
  }
}

/**
 * 创建断裂分析
 */
export async function createFracture(params: Fracture): Promise<Fracture> {
  try {
    const response = await http.post<Fracture>('/api/v2/fracture', params)
    return response
  } catch (error) {
    console.error('创建断裂分析失败:', error)
    throw error
  }
}

/**
 * 批量导出断裂分析数据
 */
export async function exportFractures(ids: number[]): Promise<Blob> {
  try {
    const response = await http.post<Blob>(
      '/api/v2/fracture/export',
      { ids },
      {
        responseType: 'blob',
      },
    )
    return response
  } catch (error) {
    console.error('导出断裂分析数据失败:', error)
    throw error
  }
}

/**
 * 导入断裂分析数据
 */
export async function importFractures(file: File): Promise<{ success: number; failed: number }> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await http.post<{ success: number; failed: number }>(
      '/api/v2/fracture/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  } catch (error) {
    console.error('导入断裂分析数据失败:', error)
    throw error
  }
}

export default {
  getFractures,
  createFracture,
  exportFractures,
  importFractures,
}
