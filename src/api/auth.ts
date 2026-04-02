// 用户认证API - 模拟数据版本
// 由于后端服务暂时没有用户相关的API，这里使用模拟数据

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

export interface RegisterParams {
  username: string
  password: string
  nickname: string
  email: string
  phone?: string
}

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'auto',
    password: '123456',
    nickname: '系统管理员',
    avatar: '/avatar.png',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    permissions: ['*:*:*'],
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    nickname: '普通用户',
    avatar: '/avatar.png',
    email: 'user@example.com',
    phone: '13800138001',
    roles: ['user'],
    permissions: ['view', 'edit'],
  },
]

// 生成模拟token
const generateMockToken = (username: string): string => {
  return `mock-token-${username}-${Date.now()}`
}

// 模拟延迟
const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 用户登录 - 模拟版本
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    await mockDelay()

    // 查找用户
    const user = mockUsers.find(
      (u) => u.username === params.username && u.password === params.password,
    )

    if (!user) {
      throw new Error('用户名或密码错误')
    }

    // 创建响应数据
    const response: LoginResponse = {
      token: generateMockToken(user.username),
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        permissions: user.permissions,
      },
    }

    // 保存token到localStorage
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
    }

    return response
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

/**
 * 用户退出 - 模拟版本
 */
export async function logout(): Promise<void> {
  try {
    await mockDelay(300)

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  } catch (error) {
    console.error('退出失败:', error)
    throw error
  }
}

/**
 * 获取用户信息 - 模拟版本
 */
export async function getUserInfo(): Promise<UserInfo> {
  try {
    await mockDelay()

    // 从本地存储获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      return JSON.parse(userInfoStr)
    }

    // 如果没有登录信息，返回默认用户
    const defaultUser = mockUsers[0] || mockUsers[1] // 确保有默认用户
    if (!defaultUser) {
      throw new Error('没有可用的用户数据')
    }

    return {
      id: defaultUser.id,
      username: defaultUser.username,
      nickname: defaultUser.nickname,
      avatar: defaultUser.avatar,
      email: defaultUser.email,
      phone: defaultUser.phone,
      roles: defaultUser.roles,
      permissions: defaultUser.permissions,
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

/**
 * 更新用户信息 - 模拟版本
 */
export async function updateUserInfo(params: Partial<UserInfo>): Promise<UserInfo> {
  try {
    await mockDelay()

    // 获取当前用户信息
    const currentUser = await getUserInfo()

    // 合并更新
    const updatedUser = {
      ...currentUser,
      ...params,
    }

    // 更新本地存储
    localStorage.setItem('userInfo', JSON.stringify(updatedUser))

    return updatedUser
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error
  }
}

/**
 * 修改密码 - 模拟版本
 */
export async function changePassword(params: {
  oldPassword: string
  newPassword: string
}): Promise<void> {
  try {
    await mockDelay()

    // 这里只是模拟，实际应该验证旧密码
    console.log('密码修改成功（模拟）')
  } catch (error) {
    console.error('修改密码失败:', error)
    throw error
  }
}

/**
 * 用户注册 - 模拟版本
 */
export async function register(params: RegisterParams): Promise<UserInfo> {
  try {
    await mockDelay()

    // 检查用户名是否已存在
    const existingUser = mockUsers.find((u) => u.username === params.username)
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    // 创建新用户
    const newUser = {
      id: mockUsers.length + 1,
      username: params.username,
      password: params.password,
      nickname: params.nickname,
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      email: params.email,
      phone: params.phone || '',
      roles: ['user'],
      permissions: ['view'],
    }

    // 添加到模拟用户列表（仅内存中）
    mockUsers.push(newUser)

    // 返回用户信息（不包含密码）
    return {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      email: newUser.email,
      phone: newUser.phone,
      roles: newUser.roles,
      permissions: newUser.permissions,
    }
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}

/**
 * 检查登录状态
 */
export function checkLoginStatus(): boolean {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')

  return !!(token && userInfo)
}

/**
 * 获取当前用户信息（从本地存储）
 */
export function getCurrentUser(): UserInfo | null {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
}

/**
 * 获取当前用户token
 */
export function getToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * 设置token
 */
export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

/**
 * 清除认证信息
 */
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
  register,
  checkLoginStatus,
  getCurrentUser,
  getToken,
  setToken,
  clearAuth,
}
