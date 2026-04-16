// API 统一入口
import { http } from './http'
export { http }
export default http

// 导出所有API模块
export * from './types'
export * from './user'

import { userApi, roleApi, permissionApi, authLogApi, adminApi } from './user'
import type {
  User,
  UserFormData,
  Role,
  RoleFormData,
  Permission,
  PermissionFormData,
  LoginLog,
  UserSearchParams,
  RoleSearchParams,
  PermissionSearchParams,
  LoginLogSearchParams,
  PaginationResponse,
} from './user'
import type {
  Suit,
  SuitSearchParams,
  Order,
  OrderSearchParams,
  Process,
  ProcessSearchParams,
  Fracture,
  FractureSearchParams,
  Density,
  DensitySearchParams,
} from './types'
import {
  login as authLogin,
  logout as authLogout,
  getUserInfo as authGetUserInfo,
  updateUserInfo as authUpdateUserInfo,
  changePassword as authChangePassword,
  type LoginParams,
  type LoginResponse,
  type UpdateUserInfoParams,
  type ChangePasswordParams,
} from './auth'
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
    login(params: LoginParams): Promise<LoginResponse> {
      return authLogin(params)
    },
    logout(): Promise<void> {
      return authLogout()
    },
    getUserInfo(): Promise<User> {
      return authGetUserInfo()
    },
    updateUserInfo(params: UpdateUserInfoParams): Promise<User> {
      return authUpdateUserInfo(params)
    },
    changePassword(params: ChangePasswordParams): Promise<void> {
      return authChangePassword(params)
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
  admin: {
    getUsers: userApi.getUsers,
    createUser: adminApi.createUser,
    updateUser: adminApi.updateUser,
    deleteUser: adminApi.deleteUser,
    getRoles: roleApi.getRoles,
    createRole: adminApi.createRole,
    updateRole: adminApi.updateRole,
    deleteRole: adminApi.deleteRole,
    getPermissions: permissionApi.getPermissions,
    createPermission: adminApi.createPermission,
    updatePermission: adminApi.updatePermission,
    deletePermission: adminApi.deletePermission,
    assignUserRole: adminApi.assignUserRole,
    removeUserRole: adminApi.removeUserRole,
    getUserRoles: userApi.getUserRoles,
    assignRolePermission: adminApi.assignRolePermission,
    removeRolePermission: adminApi.removeRolePermission,
    getRolePermissions: roleApi.getRolePermissions,
    getLoginLogs: authLogApi.getLoginLogs,
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
    getRealtimeActivities: async (params?: any) => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getRealtimeActivities(params)
    },
    getNodes: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getNodes()
    },
    getNodeMonitor: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getNodeMonitor()
    },
    getTodayStats: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getTodayStats()
    },
    getHistoryStats: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getHistoryStats()
    },
    getRunningTasks: async () => {
      const dashboardModule = await import('./dashboard')
      return dashboardModule.default.getRunningTasks()
    },
  },
}
