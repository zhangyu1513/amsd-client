// 子单管理API
import { http } from './index'
import type { Suit, Order, OrderSearchParams, PaginatedResponse } from './types'

/**
 * 获取子单列表
 */
export async function getOrders(params: OrderSearchParams): Promise<PaginatedResponse<Order>> {
  try {
    const response = await http.get<PaginatedResponse<Order>>('/api/v2/orders', {
      params: params,
    })
    return response
  } catch (error) {
    console.error('获取子单列表失败:', error)
    throw error
  }
}

/**
 * 获取单个子单详情
 */
export async function getOrder(id: number): Promise<Order> {
  try {
    const response = await http.get<Order>(`/api/v2/order`, { params: { ID: id } })
    return response
  } catch (error) {
    console.error(`获取子单 ${id} 详情失败:`, error)
    throw error
  }
}

export default {
  getOrders,
  getOrder,
}
