import { http } from './http'
import type { User, Role } from './user'

export interface LoginParams {
  Username: string
  Password: string
}

export interface LoginResponse {
  Token: string
  ExpiresAt: number
  User: User
  Roles: Role[]
}

export interface UpdateUserInfoParams {
  Name?: string
}

export interface ChangePasswordParams {
  OldPassword: string
  NewPassword: string
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/api/v2/auth/login', params)
  if (response.Token) {
    localStorage.setItem('token', response.Token)
    localStorage.setItem('userInfo', JSON.stringify(response.User))
    localStorage.setItem('userRoles', JSON.stringify(response.Roles))
  }
  return response
}

export async function logout(): Promise<void> {
  await http.post<void>('/api/v2/auth/logout')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

export async function getUserInfo(): Promise<User> {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch {
      console.error('解析用户信息失败')
    }
  }
  throw new Error('用户未登录')
}

export async function updateUserInfo(params: UpdateUserInfoParams): Promise<User> {
  const currentUser = await getUserInfo()
  const updatedUser = await http.put<User>('/api/v2/users', {
    ID: currentUser.ID,
    ...params,
  })
  localStorage.setItem('userInfo', JSON.stringify(updatedUser))
  return updatedUser
}

export async function changePassword(params: ChangePasswordParams): Promise<void> {
  await http.put<User>('/api/v2/users', {
    Password: params.NewPassword,
  })
}

export function checkLoginStatus(): boolean {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  return !!(token && userInfo)
}

export function getCurrentUser(): User | null {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch {
      console.error('解析用户信息失败')
      return null
    }
  }
  return null
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function clearAuth(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

export default {
  login,
  logout,
  getUserInfo,
  updateUserInfo,
  changePassword,
  checkLoginStatus,
  getCurrentUser,
  getToken,
  setToken,
  clearAuth,
}
