import { http } from './http'
import { ElMessage } from 'element-plus'

export interface User {
  ID: number
  Username: string
  Name: string
  Status: string
  Roles?: Role[]
  CreatedAt?: string
  UpdatedAt?: string
}

export interface UserFormData {
  ID?: number
  Username: string
  Password?: string
  Name: string
  Status?: string
}

export interface Role {
  ID: number
  Name: string
  Code: string
  Description: string
  Status: string
  CreatedAt?: string
  UpdatedAt?: string
}

export interface RoleFormData {
  ID?: number
  Name: string
  Code: string
  Description?: string
  Status?: string
}

export interface Permission {
  ID: number
  Name: string
  Code: string
  Resource: string
  Action: string
  Description: string
  CreatedAt?: string
  UpdatedAt?: string
}

export interface PermissionFormData {
  ID?: number
  Name: string
  Code: string
  Resource: string
  Action: string
  Description?: string
}

export interface LoginLog {
  ID: number
  UserID: number
  Username: string
  Ip: string
  UserAgent: string
  Status: string
  Message: string
  CreatedAt: string
}

export interface LoginLogSearchParams {
  Page?: number
  PageSize?: number
}

export interface UserSearchParams {
  Page?: number
  PageSize?: number
  Username?: string
  Name?: string
  Status?: string
}

export interface RoleSearchParams {
  Page?: number
  PageSize?: number
  Name?: string
  Code?: string
  Status?: string
}

export interface PermissionSearchParams {
  Page?: number
  PageSize?: number
  Name?: string
  Code?: string
  Resource?: string
  Action?: string
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  code: number
  message: string
  data: null
}

export const userApi = {
  getUsers(params: UserSearchParams): Promise<PaginationResponse<User>> {
    return http.get<PaginationResponse<User>>('/api/v2/users', { params })
  },

  getUser(params: { ID?: number; Username?: string }): Promise<User> {
    return http.get<User>('/api/v2/user', { params })
  },

  createUser(data: UserFormData): Promise<User> {
    return http.post<User>('/api/v2/users', data)
  },

  updateUser(data: UserFormData): Promise<User> {
    return http.put<User>('/api/v2/users', data)
  },

  deleteUser(ID: number): Promise<null> {
    return http.delete<null>('/api/v2/users', { params: { ID: ID } })
  },

  assignUserRole(UserID: number, RoleID: number): Promise<null> {
    return http.post<null>('/api/v2/users/roles', { user_id: UserID, role_id: RoleID })
  },

  removeUserRole(UserID: number, RoleID: number): Promise<null> {
    return http.delete<null>('/api/v2/users/roles', { data: { user_id: UserID, role_id: RoleID } })
  },

  toggleUserRole(UserID: number, RoleID: number): Promise<{ assigned: boolean }> {
    return http.put<{ assigned: boolean }>('/api/v2/users/roles', {
      UserID: UserID,
      RoleID: RoleID,
    })
  },

  getUserRoles(UserID: number): Promise<Role[]> {
    return http.get<Role[]>('/api/v2/users/roles', { params: { ID: UserID } })
  },

  getUserPermissions(UserID: number): Promise<Permission[]> {
    return http.get<Permission[]>('/api/v2/users/permissions', { params: { ID: UserID } })
  },
}

export const roleApi = {
  getRoles(params: RoleSearchParams): Promise<PaginationResponse<Role>> {
    return http.get<PaginationResponse<Role>>('/api/v2/roles', { params })
  },

  getRole(params: { ID?: number; Code?: string }): Promise<Role> {
    return http.get<Role>('/api/v2/role', { params })
  },

  createRole(data: RoleFormData): Promise<Role> {
    return http.post<Role>('/api/v2/roles', data)
  },

  updateRole(data: RoleFormData): Promise<Role> {
    return http.put<Role>('/api/v2/roles', data)
  },

  deleteRole(ID: number): Promise<null> {
    return http.delete<null>('/api/v2/roles', { params: { ID: ID } })
  },

  assignRolePermission(RoleID: number, permissionID: number): Promise<null> {
    return http.post<null>('/api/v2/roles/permissions', {
      RoleID: RoleID,
      PermissionID: permissionID,
    })
  },

  removeRolePermission(RoleID: number, PermissionID: number): Promise<null> {
    return http.delete<null>('/api/v2/roles/permissions', {
      data: { RoleID: RoleID, PermissionID: PermissionID },
    })
  },

  getRolePermissions(RoleID: number): Promise<Permission[]> {
    return http.get<Permission[]>('/api/v2/roles/permissions', { params: { ID: RoleID } })
  },
}

export const permissionApi = {
  getPermissions(params: PermissionSearchParams): Promise<PaginationResponse<Permission>> {
    return http.get<PaginationResponse<Permission>>('/api/v2/permissions', { params })
  },

  getPermission(params: { ID?: number; Code?: string }): Promise<Permission> {
    return http.get<Permission>('/api/v2/permission', { params })
  },

  createPermission(data: PermissionFormData): Promise<Permission> {
    return http.post<Permission>('/api/v2/permissions', data)
  },

  updatePermission(data: PermissionFormData): Promise<Permission> {
    return http.put<Permission>('/api/v2/permissions', data)
  },

  deletePermission(ID: number): Promise<null> {
    return http.delete<null>('/api/v2/permissions', { params: { ID: ID } })
  },
}

export const authLogApi = {
  getLoginLogs(params: LoginLogSearchParams): Promise<PaginationResponse<LoginLog>> {
    return http.get<PaginationResponse<LoginLog>>('/api/v2/auth/login_logs', { params })
  },
}

export const adminApi = {
  async createUser(data: UserFormData): Promise<User> {
    const res = await userApi.createUser(data)
    ElMessage.success('用户创建成功')
    return res
  },

  async updateUser(data: UserFormData): Promise<User> {
    const res = await userApi.updateUser(data)
    ElMessage.success('用户更新成功')
    return res
  },

  async deleteUser(ID: number): Promise<void> {
    await userApi.deleteUser(ID)
    ElMessage.success('用户删除成功')
  },

  async assignUserRole(UserID: number, RoleID: number): Promise<void> {
    await userApi.assignUserRole(UserID, RoleID)
    ElMessage.success('角色分配成功')
  },

  async removeUserRole(UserID: number, RoleID: number): Promise<void> {
    await userApi.removeUserRole(UserID, RoleID)
    ElMessage.success('角色移除成功')
  },

  async toggleUserRole(UserID: number, RoleID: number): Promise<boolean> {
    const res = await userApi.toggleUserRole(UserID, RoleID)
    ElMessage.success(res.assigned ? '角色分配成功' : '角色移除成功')
    return res.assigned
  },

  async createRole(data: RoleFormData): Promise<Role> {
    const res = await roleApi.createRole(data)
    ElMessage.success('角色创建成功')
    return res
  },

  async updateRole(data: RoleFormData): Promise<Role> {
    const res = await roleApi.updateRole(data)
    ElMessage.success('角色更新成功')
    return res
  },

  async deleteRole(ID: number): Promise<void> {
    await roleApi.deleteRole(ID)
    ElMessage.success('角色删除成功')
  },

  async assignRolePermission(RoleID: number, PermissionID: number): Promise<void> {
    await roleApi.assignRolePermission(RoleID, PermissionID)
    ElMessage.success('权限分配成功')
  },

  async removeRolePermission(RoleID: number, PermissionID: number): Promise<void> {
    await roleApi.removeRolePermission(RoleID, PermissionID)
    ElMessage.success('权限移除成功')
  },

  async createPermission(data: PermissionFormData): Promise<Permission> {
    const res = await permissionApi.createPermission(data)
    ElMessage.success('权限创建成功')
    return res
  },

  async updatePermission(data: PermissionFormData): Promise<Permission> {
    const res = await permissionApi.updatePermission(data)
    ElMessage.success('权限更新成功')
    return res
  },

  async deletePermission(ID: number): Promise<void> {
    await permissionApi.deletePermission(ID)
    ElMessage.success('权限删除成功')
  },
}

export default {
  user: userApi,
  role: roleApi,
  permission: permissionApi,
  authLog: authLogApi,
  admin: adminApi,
}
