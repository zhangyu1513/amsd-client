# AMSD Client API 文档

基于后端 `/api/v2` 接口开发的客户端API模块，提供类型安全的API调用。

## 目录结构

```
src/api/
├── index.ts          # 统一入口，导出所有API模块
├── types.ts          # 类型定义
├── auth.ts           # 用户认证API
├── suit.ts           # 套单管理API
├── order.ts          # 子单管理API
├── process.ts        # 处理任务API
├── fracture.ts       # 断裂分析API
├── density.ts        # 密度分析API
├── log.ts            # 日志管理API
└── dashboard.ts      # 仪表盘API
```

## 快速开始

### 1. 导入API模块

```typescript
// 方式1：导入统一的api对象
import { api } from '@/api'

// 方式2：导入具体的API模块
import { getSuits, createSuit } from '@/api/suit'
import { login, logout } from '@/api/auth'
```

### 2. 基本使用示例

#### 用户认证

```typescript
import { login, logout, getUserInfo } from '@/api/auth'

// 用户登录
async function handleLogin() {
  try {
    const response = await login({
      username: 'admin',
      password: 'admin123',
    })
    console.log('登录成功:', response)
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 获取用户信息
async function loadUserInfo() {
  try {
    const userInfo = await getUserInfo()
    console.log('用户信息:', userInfo)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
```

#### 套单管理

```typescript
import { getSuits, getSuit, createSuit, updateSuit, deleteSuit } from '@/api/suit'

// 获取套单列表（带分页）
async function loadSuits() {
  try {
    const response = await getSuits({
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
    console.log('套单列表:', response)
  } catch (error) {
    console.error('获取套单列表失败:', error)
  }
}

// 创建套单
async function createNewSuit() {
  try {
    const suit = await createSuit({
      number: 'SUIT-001',
      customerCode: 'CUST-001',
      customerName: '测试客户',
      saler: '张三',
    })
    console.log('创建成功:', suit)
  } catch (error) {
    console.error('创建套单失败:', error)
  }
}
```

#### 子单管理

```typescript
import { getOrders, getOrdersBySuit } from '@/api/order'

// 获取所有子单
async function loadAllOrders() {
  try {
    const response = await getOrders({
      page: 1,
      pageSize: 20,
    })
    console.log('子单列表:', response)
  } catch (error) {
    console.error('获取子单列表失败:', error)
  }
}

// 获取特定套单下的子单
async function loadSuitOrders(suitId: number) {
  try {
    const response = await getOrdersBySuit(suitId, {
      page: 1,
      pageSize: 10,
    })
    console.log('套单子单:', response)
  } catch (error) {
    console.error('获取套单子单失败:', error)
  }
}
```

#### 处理任务

```typescript
import { getProcesses, createProcess } from '@/api/process'

// 获取处理任务列表
async function loadProcesses() {
  try {
    const response = await getProcesses({
      suitId: 1,
      page: 1,
      pageSize: 10,
    })
    console.log('处理任务列表:', response)
  } catch (error) {
    console.error('获取处理任务失败:', error)
  }
}
```

#### 仪表盘数据

```typescript
import { getDashboardStats, getTaskTrendData } from '@/api/dashboard'

// 获取仪表盘统计数据
async function loadDashboardData() {
  try {
    const stats = await getDashboardStats()
    const trendData = await getTaskTrendData({ days: 7 })

    console.log('统计数据:', stats)
    console.log('趋势数据:', trendData)
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}
```

## API 分类说明

### 1. 用户认证 (auth.ts)

- `login()` - 用户登录
- `logout()` - 用户退出
- `getUserInfo()` - 获取用户信息
- `updateUserInfo()` - 更新用户信息
- `changePassword()` - 修改密码
- `register()` - 用户注册

### 2. 套单管理 (suit.ts)

- `getSuits()` - 获取套单列表（分页）
- `getSuit()` - 获取单个套单详情
- `createSuit()` - 创建套单
- `updateSuit()` - 更新套单
- `deleteSuit()` - 删除套单
- `getSuitStats()` - 获取套单统计信息

### 3. 子单管理 (order.ts)

- `getOrders()` - 获取子单列表（分页）
- `getOrder()` - 获取单个子单详情
- `createOrder()` - 创建子单
- `updateOrder()` - 更新子单
- `deleteOrder()` - 删除子单
- `getOrdersBySuit()` - 获取套单下的子单列表
- `getOrderStats()` - 获取子单统计信息

### 4. 处理任务 (process.ts)

- `getProcesses()` - 获取处理任务列表
- `createProcess()` - 创建处理任务
- `updateProcess()` - 更新处理任务
- `getProcessesBySuit()` - 获取套单下的处理任务
- `getProcessesByOrder()` - 获取子单下的处理任务
- `getProcessLog()` - 获取处理任务日志
- `getProcessStats()` - 获取处理任务统计信息

### 5. 断裂分析 (fracture.ts)

- `getFractures()` - 获取断裂分析列表
- `createFracture()` - 创建断裂分析
- `updateFracture()` - 更新断裂分析
- `getFracturesBySuit()` - 获取套单下的断裂分析
- `getFracturesByOrder()` - 获取子单下的断裂分析
- `getFractureLog()` - 获取断裂分析日志
- `getFractureStats()` - 获取断裂分析统计信息

### 6. 密度分析 (density.ts)

- `getDensities()` - 获取密度分析列表
- `createDensity()` - 创建密度分析
- `updateDensity()` - 更新密度分析
- `getDensitiesBySuit()` - 获取套单下的密度分析
- `getDensitiesByOrder()` - 获取子单下的密度分析
- `getDensityLog()` - 获取密度分析日志
- `getDensityStats()` - 获取密度分析统计信息
- `getDensityChartData()` - 获取密度分析图表数据

### 7. 日志管理 (log.ts)

- `getSystemLogs()` - 获取系统日志
- `getProcessLogs()` - 获取处理任务日志
- `getFractureLogs()` - 获取断裂分析日志
- `getDensityLogs()` - 获取密度分析日志
- `searchLogs()` - 搜索日志
- `exportLogs()` - 导出日志
- `clearLogs()` - 清理日志
- `getLogStats()` - 获取日志统计信息

### 8. 仪表盘 (dashboard.ts)

- `getDashboardStats()` - 获取仪表盘统计数据
- `getTaskTrendData()` - 获取任务趋势数据
- `getTaskDistributionData()` - 获取任务分布数据
- `getPerformanceMetrics()` - 获取性能指标
- `getRealtimeActivities()` - 获取实时活动数据
- `getResourceUsage()` - 获取资源使用情况
- `getBusinessMetrics()` - 获取业务指标
- `getAlerts()` - 获取预警信息

## 错误处理

所有API函数都包含try-catch错误处理，建议在使用时也进行错误捕获：

```typescript
try {
  const data = await getSuits(params)
  // 处理成功数据
} catch (error) {
  console.error('API调用失败:', error)
  // 显示错误提示给用户
  ElMessage.error('获取数据失败，请重试')
}
```

## 类型安全

所有API都使用TypeScript类型定义，提供完整的类型提示：

```typescript
import type { Suit, PaginationParams, PaginatedResponse } from '@/api/types'

// 类型安全的参数和返回值
async function getSuits(params?: PaginationParams): Promise<PaginatedResponse<Suit>> {
  // ...
}
```

## Mock 数据

开发环境下使用mock数据，所有接口都已配置mock响应，支持：

- 分页数据
- 随机生成的数据
- 错误状态模拟
- 延迟响应

## 配置说明

API基础URL配置在 `.env.development` 文件中：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 注意事项

1. 所有API调用都自动携带token认证
2. 401错误会自动跳转到登录页
3. 响应拦截器统一处理错误消息
4. 支持文件上传和下载
5. 提供完整的类型定义和文档

## 更新日志

### v1.0.0 (2024-03-31)

- 基于后端 `/api/v2` 接口开发
- 完整的API模块分类
- TypeScript类型定义
- Mock数据支持
- 错误处理和拦截器
- 文档和示例代码
