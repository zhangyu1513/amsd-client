// 密度分析API
import { http } from './index'
import type { Density } from './types'

/**
 * 获取密度分析列表
 */
export async function getDensities(params?: { ProcessID?: number }): Promise<Density[]> {
  try {
    const response = await http.get<Density[]>('/api/v2/densities', { params })
    return response
  } catch (error) {
    console.error('获取密度分析列表失败:', error)
    throw error
  }
}

/**
 * 创建密度分析
 */
export async function createDensity(params: Density): Promise<Density> {
  try {
    const response = await http.post<Density>('/api/v2/density', params)
    return response
  } catch (error) {
    console.error('创建密度分析失败:', error)
    throw error
  }
}

/**
 * 批量导出密度分析数据
 */
export async function exportDensities(ids: number[]): Promise<Blob> {
  try {
    const response = await http.post<Blob>(
      '/api/v2/density/export',
      { ids },
      {
        responseType: 'blob',
      },
    )
    return response
  } catch (error) {
    console.error('导出密度分析数据失败:', error)
    throw error
  }
}

/**
 * 导入密度分析数据
 */
export async function importDensities(file: File): Promise<{ success: number; failed: number }> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await http.post<{ success: number; failed: number }>(
      '/api/v2/density/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  } catch (error) {
    console.error('导入密度分析数据失败:', error)
    throw error
  }
}

/**
 * 获取密度分析图表数据
 */
export async function getDensityChartData(densityId: number): Promise<{
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
  }>
}> {
  try {
    // 模拟图表数据
    const labels = ['区域1', '区域2', '区域3', '区域4', '区域5']
    const datasets = [
      {
        label: '密度值',
        data: labels.map(() => Math.random() * 100),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ]

    return { labels, datasets }
  } catch (error) {
    console.error(`获取密度分析 ${densityId} 图表数据失败:`, error)
    throw error
  }
}

export default {
  getDensities,
  createDensity,
  exportDensities,
  importDensities,
  getDensityChartData,
}
