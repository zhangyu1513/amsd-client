import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)

  // token
  const token = ref<string>('')

  // 是否已登录
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 用户角色
  const userRoles = computed(() => userInfo.value?.roles || [])

  // 用户权限
  const userPermissions = computed(() => userInfo.value?.permissions || [])

  // 初始化
  function init() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userInfo')

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
  }

  // 登录 - 使用API模块
  async function login(credentials: { username: string; password: string }) {
    try {
      // 导入API模块
      const { api } = await import('@/api')

      // 调用API登录
      const response = await api.auth.login(credentials)

      // 保存到store
      userInfo.value = response.userInfo
      token.value = response.token

      // 保存到localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))

      return true
    } catch (error: any) {
      return false
    }
  }

  // 登出
  async function logout() {
    try {
      // // 导入API模块
      // const { api } = await import('@/api')

      // // 调用API退出
      // await api.auth.logout()

      // 清除store状态
      userInfo.value = null
      token.value = ''

      // 清除localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    } catch (error: any) {
      console.error('退出失败:', error)
      // 即使API调用失败，也清除本地状态
      userInfo.value = null
      token.value = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }

  // 更新用户信息
  async function updateUserInfo(info: Partial<UserInfo>) {
    if (!userInfo.value) return false

    try {
      // 导入API模块
      const { api } = await import('@/api')

      // 调用API更新用户信息
      const updatedUser = await api.auth.updateUserInfo(info)

      // 更新store状态
      userInfo.value = updatedUser
      localStorage.setItem('userInfo', JSON.stringify(updatedUser))

      ElMessage.success('用户信息更新成功')
      return true
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      ElMessage.error(error.message || '更新失败')
      return false
    }
  }

  // 检查权限
  function hasPermission(permission: string): boolean {
    if (!userInfo.value) return false

    // 如果有所有权限
    if (userPermissions.value.includes('*:*:*')) {
      return true
    }

    return userPermissions.value.includes(permission)
  }

  // 检查角色
  function hasRole(role: string): boolean {
    if (!userInfo.value) return false
    return userRoles.value.includes(role)
  }

  // 初始化
  init()

  return {
    userInfo,
    token,
    isLoggedIn,
    userRoles,
    userPermissions,
    login,
    logout,
    updateUserInfo,
    hasPermission,
    hasRole,
  }
})
