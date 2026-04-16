// 套单管理API
import { http } from './http'
import type { Suit, SuitSearchParams, PaginatedResponse } from './types'

/**
 * 获取套单列表
 */
export async function getSuits(params: SuitSearchParams): Promise<PaginatedResponse<Suit>> {
  try {
    const response = await http.get<PaginatedResponse<Suit>>('/api/v2/suits', { params: params })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 获取单个套单详情
 */
export async function getSuit(params: Suit): Promise<Suit> {
  try {
    const response = await http.get<Suit>(`/api/v2/suit`, { params: params })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 删除套单
 */
export async function deleteSuit(id: number): Promise<void> {
  try {
    await http.delete(`/api/v2/suit`, { params: { id } })
  } catch (error) {
    console.error(`删除套单 ${id} 失败:`, error)
    throw error
  }
}

export default {
  getSuits,
  getSuit,
  deleteSuit,
}
