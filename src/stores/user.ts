import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { User, Role } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<User | null>(null)
  const token = ref<string>('')
  const userRoles = ref<Role[]>([])

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  function init() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userInfo')
    const storedRoles = localStorage.getItem('userRoles')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        userInfo.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('userInfo')
      }
    }

    if (storedRoles) {
      try {
        userRoles.value = JSON.parse(storedRoles)
      } catch {
        console.error('解析用户角色失败')
      }
    }
  }

  async function login(credentials: { username: string; password: string }) {
    try {
      const { api } = await import('@/api')
      const response = await api.auth.login({
        Username: credentials.username,
        Password: credentials.password,
      })

      userInfo.value = response.User
      token.value = response.Token
      userRoles.value = response.Roles

      return true
    } catch {
      return false
    }
  }

  async function logout() {
    try {
      const { api } = await import('@/api')
      await api.auth.logout()
    } catch (error) {
      console.error('退出失败:', error)
    } finally {
      userInfo.value = null
      token.value = ''
      userRoles.value = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userRoles')
    }
  }

  async function updateUserInfo(info: { Name?: string }) {
    if (!userInfo.value) return false

    try {
      const { api } = await import('@/api')
      const updatedUser = await api.auth.updateUserInfo(info)

      userInfo.value = updatedUser
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))

      ElMessage.success('用户信息更新成功')
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新失败'
      console.error('更新用户信息失败:', error)
      ElMessage.error(message)
      return false
    }
  }

  function hasPermission(_permission: string): boolean {
    return true
  }

  function hasRole(role: string): boolean {
    if (!userInfo.value) return false
    return userRoles.value.some((r) => r.Code === role)
  }

  function isAdmin(): boolean {
    return hasRole('super_admin')
  }

  init()

  return {
    userInfo,
    token,
    userRoles,
    isLoggedIn,
    login,
    logout,
    updateUserInfo,
    hasPermission,
    hasRole,
    isAdmin,
  }
})
