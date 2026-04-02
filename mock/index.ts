import Mock from 'mockjs'
import type { MockMethod } from 'vite-plugin-mock'

// 用户相关接口
const userMocks: MockMethod[] = [
  {
    url: '/api/auth/login',
    method: 'post',
    timeout: 1000,
    response: ({ body }: { body: any }) => {
      const { username, password } = body

      if (username === 'admin' && password === 'admin123') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: Mock.Random.guid(),
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: 'zhangyu',
              avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              email: 'admin@example.com',
              phone: '13800138000',
              roles: ['admin'],
              permissions: ['*:*:*'],
            },
          },
        }
      } else {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null,
        }
      }
    },
  },

  {
    url: '/api/auth/logout',
    method: 'post',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: '退出成功',
        data: null,
      }
    },
  },

  {
    url: '/api/user/info',
    method: 'get',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          username: 'admin',
          nickname: 'zhangyu',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          email: 'admin@example.com',
          phone: '13800138000',
          roles: ['admin'],
          permissions: ['*:*:*'],
        },
      }
    },
  },
]

// 套单相关接口
const suitMocks: MockMethod[] = [
  {
    url: '/api/suits',
    method: 'get',
    timeout: 800,
    response: () => {
      const count = Mock.Random.integer(5, 20)
      const suits = []

      for (let i = 1; i <= count; i++) {
        suits.push({
          id: i,
          name: `测试套单${i}`,
          description: Mock.Random.cparagraph(1, 3),
          status: Mock.Random.pick(['pending', 'processing', 'completed', 'failed']),
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          orderCount: Mock.Random.integer(0, 50),
          processCount: Mock.Random.integer(0, 30),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: suits,
          total: count,
          page: 1,
          pageSize: 10,
        },
      }
    },
  },

  // workspace页面专用接口 - 生成100条套单数据
  {
    url: '/api/workspace/suits',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const total = 100 // 固定100条数据

      const suits = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      // 生成100条数据的固定种子，确保每次请求数据一致
      const customerNames = [
        '测试客户一',
        '测试客户二',
        '测试客户三',
        '测试客户四',
        '测试客户五',
        '测试客户六',
        '测试客户七',
        '测试客户八',
        '测试客户九',
        '测试客户十',
        '阿里巴巴',
        '腾讯科技',
        '百度公司',
        '京东集团',
        '字节跳动',
        '华为技术',
        '小米科技',
        '美团点评',
        '拼多多',
        '网易公司',
      ]

      const salers = [
        '张三',
        '李四',
        '王五',
        '赵六',
        '孙七',
        '周八',
        '吴九',
        '郑十',
        '王一',
        '李二',
      ]

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const customerIndex = (i - 1) % customerNames.length
        const salerIndex = (i - 1) % salers.length

        suits.push({
          ID: i,
          CreatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          UpdatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          Number: `SUIT-${String(i).padStart(3, '0')}`,
          CustomerCode: `CUST-${String((i % 50) + 1).padStart(3, '0')}`,
          CustomerName: customerNames[customerIndex],
          Status: i % 3 === 0 ? 'close' : 'open', // 每3条有一条是close状态
          Saler: salers[salerIndex],
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: suits,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/suits/:id',
    method: 'get',
    timeout: 500,
    response: ({ query }: { query: any }) => {
      const id = query.id || 1

      return {
        code: 200,
        message: '获取成功',
        data: {
          id,
          name: `测试套单${id}`,
          description: Mock.Random.cparagraph(2, 4),
          status: Mock.Random.pick(['pending', 'processing', 'completed', 'failed']),
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          orderCount: Mock.Random.integer(0, 50),
          processCount: Mock.Random.integer(0, 30),
        },
      }
    },
  },

  {
    url: '/api/suits',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '创建成功',
        data: {
          id: Mock.Random.integer(1000, 9999),
          ...body,
          status: 'pending',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          orderCount: 0,
          processCount: 0,
        },
      }
    },
  },

  {
    url: '/api/suits/:id',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updateTime: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/suits/:id',
    method: 'delete',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },
]

// 子单相关接口
const orderMocks: MockMethod[] = [
  {
    url: '/api/suits/:suitId/orders',
    method: 'get',
    timeout: 800,
    response: () => {
      const count = Mock.Random.integer(5, 30)
      const orders = []

      for (let i = 1; i <= count; i++) {
        orders.push({
          id: i,
          suitId: Mock.Random.integer(1, 10),
          name: `子单${i}`,
          type: Mock.Random.pick(['type_a', 'type_b', 'type_c']),
          status: Mock.Random.pick(['pending', 'processing', 'completed', 'failed']),
          priority: Mock.Random.pick(['low', 'medium', 'high']),
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          progress: Mock.Random.integer(0, 100),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: orders,
          total: count,
          page: 1,
          pageSize: 10,
        },
      }
    },
  },
]

// 处理任务相关接口
const processMocks: MockMethod[] = [
  {
    url: '/api/suits/:suitId/processes',
    method: 'get',
    timeout: 800,
    response: () => {
      const count = Mock.Random.integer(5, 25)
      const processes = []

      for (let i = 1; i <= count; i++) {
        const status = Mock.Random.pick(['pending', 'running', 'completed', 'failed', 'paused'])
        const startTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')

        processes.push({
          id: i,
          suitId: Mock.Random.integer(1, 10),
          orderId: Mock.Random.integer(1, 30),
          name: `处理任务${i}`,
          type: Mock.Random.pick(['normal', 'batch', 'urgent']),
          status,
          startTime,
          endTime:
            status === 'completed' || status === 'failed'
              ? Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
              : null,
          duration: Mock.Random.pick(['30分', '1小时', '2小时', '4小时']),
          operator: Mock.Random.pick(['张三', '李四', '王五', '赵六']),
          result: status === 'completed' ? '成功' : status === 'failed' ? '处理失败' : '',
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: processes,
          total: count,
          page: 1,
          pageSize: 10,
        },
      }
    },
  },
]

// 日志相关接口
const logMocks: MockMethod[] = [
  {
    url: '/api/logs',
    method: 'get',
    timeout: 800,
    response: () => {
      const count = Mock.Random.integer(10, 50)
      const logs = []

      const levels = ['info', 'warning', 'error', 'debug']
      const sources = ['system', 'database', 'auth', 'task', 'api']

      for (let i = 1; i <= count; i++) {
        const level = Mock.Random.pick(levels)
        const source = Mock.Random.pick(sources)

        logs.push({
          id: i,
          level,
          message: Mock.Random.csentence(5, 15),
          timestamp: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
          source,
          data: Mock.Random.boolean()
            ? {
                [Mock.Random.word()]: Mock.Random.word(),
                [Mock.Random.word()]: Mock.Random.integer(1, 100),
                [Mock.Random.word()]: Mock.Random.boolean(),
              }
            : null,
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: logs,
          total: count,
          page: 1,
          pageSize: 10,
        },
      }
    },
  },
]

// 仪表盘统计接口
const dashboardMocks: MockMethod[] = [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    timeout: 600,
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          totalSuits: Mock.Random.integer(100, 500),
          totalOrders: Mock.Random.integer(500, 2000),
          totalProcesses: Mock.Random.integer(200, 1000),
          activeTasks: Mock.Random.integer(10, 50),
          todayNewSuits: Mock.Random.integer(1, 20),
          todayNewOrders: Mock.Random.integer(5, 50),
          successRate: Mock.Random.float(85, 99, 2, 2),
          avgProcessTime: Mock.Random.float(1, 5, 2, 2),
        },
      }
    },
  },

  {
    url: '/api/dashboard/chart/task-trend',
    method: 'get',
    timeout: 600,
    response: () => {
      const days = 7
      const data = []

      for (let i = days; i >= 1; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        data.push({
          date: dateStr,
          suits: Mock.Random.integer(5, 30),
          orders: Mock.Random.integer(20, 100),
          processes: Mock.Random.integer(10, 60),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data,
      }
    },
  },

  {
    url: '/api/dashboard/chart/task-distribution',
    method: 'get',
    timeout: 600,
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: [
          { name: '待处理', value: Mock.Random.integer(10, 30) },
          { name: '处理中', value: Mock.Random.integer(20, 50) },
          { name: '已完成', value: Mock.Random.integer(30, 70) },
          { name: '失败', value: Mock.Random.integer(1, 10) },
        ],
      }
    },
  },
]

// API v2 接口
const v2Mocks: MockMethod[] = [
  // 套单接口
  {
    url: '/api/v2/suits',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const total = 100

      const suits = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const customerNames = [
        '测试客户一', '测试客户二', '测试客户三', '测试客户四', '测试客户五',
        '测试客户六', '测试客户七', '测试客户八', '测试客户九', '测试客户十',
        '阿里巴巴', '腾讯科技', '百度公司', '京东集团', '字节跳动',
        '华为技术', '小米科技', '美团点评', '拼多多', '网易公司',
      ]

      const salers = [
        '张三', '李四', '王五', '赵六', '孙七',
        '周八', '吴九', '郑十', '王一', '李二',
      ]

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const customerIndex = (i - 1) % customerNames.length
        const salerIndex = (i - 1) % salers.length

        suits.push({
          id: i,
          number: `SUIT-${String(i).padStart(3, '0')}`,
          customerCode: `CUST-${String((i % 50) + 1).padStart(3, '0')}`,
          customerName: customerNames[customerIndex],
          status: i % 3 === 0 ? 'close' : 'open',
          saler: salers[salerIndex],
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: suits,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/suit',
    method: 'get',
    timeout: 500,
    response: ({ query }: { query: any }) => {
      const id = parseInt(query.id) || 1
      
      const customerNames = ['测试客户一', '测试客户二', '测试客户三', '测试客户四', '测试客户五']
      const salers = ['张三', '李四', '王五', '赵六', '孙七']
      
      const customerIndex = (id - 1) % customerNames.length
      const salerIndex = (id - 1) % salers.length

      return {
        code: 200,
        message: '获取成功',
        data: {
          id,
          number: `SUIT-${String(id).padStart(3, '0')}`,
          customerCode: `CUST-${String((id % 50) + 1).padStart(3, '0')}`,
          customerName: customerNames[customerIndex],
          status: id % 3 === 0 ? 'close' : 'open',
          saler: salers[salerIndex],
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
        },
      }
    },
  },

  {
    url: '/api/v2/suit',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      const id = Mock.Random.integer(1000, 9999)
      
      return {
        code: 200,
        message: '创建成功',
        data: {
          id,
          ...body,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/suit',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/suit',
    method: 'delete',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },

  // 子单接口
  {
    url: '/api/v2/orders',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const suitId = query.suitId ? parseInt(query.suitId) : undefined
      const total = suitId ? 30 : 100

      const orders = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const types = ['type_a', 'type_b', 'type_c']
      const statuses = ['pending', 'processing', 'completed', 'failed']
      const priorities = ['low', 'medium', 'high']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const typeIndex = (i - 1) % types.length
        const statusIndex = (i - 1) % statuses.length
        const priorityIndex = (i - 1) % priorities.length

        orders.push({
          id: i,
          suitId: suitId || Mock.Random.integer(1, 10),
          number: `ORDER-${String(i).padStart(3, '0')}`,
          name: `子单${i}`,
          type: types[typeIndex],
          status: statuses[statusIndex],
          priority: priorities[priorityIndex],
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          progress: Mock.Random.integer(0, 100),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: orders,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/order',
    method: 'get',
    timeout: 500,
    response: ({ query }: { query: any }) => {
      const id = parseInt(query.id) || 1
      
      const types = ['type_a', 'type_b', 'type_c']
      const statuses = ['pending', 'processing', 'completed', 'failed']
      const priorities = ['low', 'medium', 'high']
      
      const typeIndex = (id - 1) % types.length
      const statusIndex = (id - 1) % statuses.length
      const priorityIndex = (id - 1) % priorities.length

      return {
        code: 200,
        message: '获取成功',
        data: {
          id,
          suitId: Mock.Random.integer(1, 10),
          number: `ORDER-${String(id).padStart(3, '0')}`,
          name: `子单${id}`,
          type: types[typeIndex],
          status: statuses[statusIndex],
          priority: priorities[priorityIndex],
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          progress: Mock.Random.integer(0, 100),
        },
      }
    },
  },

  {
    url: '/api/v2/order',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      const id = Mock.Random.integer(1000, 9999)
      
      return {
        code: 200,
        message: '创建成功',
        data: {
          id,
          ...body,
          status: 'pending',
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/order',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/order',
    method: 'delete',
    timeout: 500,
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null,
      }
    },
  },

  // 处理任务接口
  {
    url: '/api/v2/processes',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const suitId = query.suitId ? parseInt(query.suitId) : undefined
      const orderId = query.orderId ? parseInt(query.orderId) : undefined
      const total = 50

      const processes = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const types = ['normal', 'batch', 'urgent']
      const statuses = ['pending', 'running', 'completed', 'failed', 'paused']
      const operators = ['张三', '李四', '王五', '赵六', '孙七']
      const durations = ['30分', '1小时', '2小时', '4小时']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const typeIndex = (i - 1) % types.length
        const statusIndex = (i - 1) % statuses.length
        const operatorIndex = (i - 1) % operators.length
        const durationIndex = (i - 1) % durations.length
        
        const status = statuses[statusIndex]
        const startTime = Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59')

        processes.push({
          id: i,
          suitId: suitId || Mock.Random.integer(1, 10),
          orderId: orderId || Mock.Random.integer(1, 30),
          name: `处理任务${i}`,
          type: types[typeIndex],
          status,
          startTime,
          endTime: status === 'completed' || status === 'failed' 
            ? Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59')
            : null,
          duration: durations[durationIndex],
          operator: operators[operatorIndex],
          result: status === 'completed' ? '成功' : status === 'failed' ? '处理失败' : '',
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: processes,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/process',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      const id = Mock.Random.integer(1000, 9999)
      
      return {
        code: 200,
        message: '创建成功',
        data: {
          id,
          ...body,
          status: 'pending',
          startTime: new Date().toISOString(),
          duration: '0分',
          result: '',
        },
      }
    },
  },

  {
    url: '/api/v2/process',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  // 断裂分析接口
  {
    url: '/api/v2/fractures',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const suitId = query.suitId ? parseInt(query.suitId) : undefined
      const orderId = query.orderId ? parseInt(query.orderId) : undefined
      const total = 40

      const fractures = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const types = ['type_a', 'type_b', 'type_c']
      const statuses = ['pending', 'processing', 'completed', 'failed']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const typeIndex = (i - 1) % types.length
        const statusIndex = (i - 1) % statuses.length

        fractures.push({
          id: i,
          suitId: suitId || Mock.Random.integer(1, 10),
          orderId: orderId || Mock.Random.integer(1, 30),
          name: `断裂分析${i}`,
          type: types[typeIndex],
          status: statuses[statusIndex],
          data: {
            length: Mock.Random.float(10, 100, 2, 2),
            width: Mock.Random.float(1, 10, 2, 2),
            depth: Mock.Random.float(0.5, 5, 2, 2),
            location: `位置${Mock.Random.integer(1, 10)}`,
          },
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: fractures,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/fracture',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      const id = Mock.Random.integer(1000, 9999)
      
      return {
        code: 200,
        message: '创建成功',
        data: {
          id,
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/fracture',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  // 密度分析接口
  {
    url: '/api/v2/densities',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const suitId = query.suitId ? parseInt(query.suitId) : undefined
      const orderId = query.orderId ? parseInt(query.orderId) : undefined
      const total = 35

      const densities = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const types = ['type_a', 'type_b', 'type_c']
      const statuses = ['pending', 'processing', 'completed', 'failed']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const typeIndex = (i - 1) % types.length
        const statusIndex = (i - 1) % statuses.length

        densities.push({
          id: i,
          suitId: suitId || Mock.Random.integer(1, 10),
          orderId: orderId || Mock.Random.integer(1, 30),
          name: `密度分析${i}`,
          type: types[typeIndex],
          status: statuses[statusIndex],
          data: {
            density: Mock.Random.float(1.5, 3.5, 2, 2),
            porosity: Mock.Random.float(5, 25, 2, 2),
            hardness: Mock.Random.float(50, 100, 2, 2),
            area: Mock.Random.float(10, 100, 2, 2),
          },
          createdAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          updatedAt: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: densities,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/density',
    method: 'post',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      const id = Mock.Random.integer(1000, 9999)
      
      return {
        code: 200,
        message: '创建成功',
        data: {
          id,
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  {
    url: '/api/v2/density',
    method: 'put',
    timeout: 800,
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '更新成功',
        data: {
          ...body,
          updatedAt: new Date().toISOString(),
        },
      }
    },
  },

  // 日志接口
  {
    url: '/api/v2/process/log',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const processId = query.processId ? parseInt(query.processId) : 1
      const total = 20

      const logs = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const levels = ['info', 'warning', 'error', 'debug']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const levelIndex = (i - 1) % levels.length

        logs.push({
          id: i,
          processId,
          level: levels[levelIndex],
          message: Mock.Random.csentence(5, 15),
          timestamp: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          data: Mock.Random.boolean()
            ? {
                step: Mock.Random.integer(1, 10),
                duration: Mock.Random.float(0.1, 5, 2, 2),
                result: Mock.Random.pick(['success', 'warning', 'error']),
              }
            : null,
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: logs,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/fracture/log',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const fractureId = query.fractureId ? parseInt(query.fractureId) : 1
      const total = 15

      const logs = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const levels = ['info', 'warning', 'error', 'debug']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const levelIndex = (i - 1) % levels.length

        logs.push({
          id: i,
          fractureId,
          level: levels[levelIndex],
          message: Mock.Random.csentence(5, 15),
          timestamp: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          data: Mock.Random.boolean()
            ? {
                measurement: Mock.Random.float(0.1, 10, 2, 2),
                accuracy: Mock.Random.float(95, 99.9, 2, 2),
                calibrated: Mock.Random.boolean(),
              }
            : null,
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: logs,
          total,
          page,
          pageSize,
        },
      }
    },
  },

  {
    url: '/api/v2/density/log',
    method: 'get',
    timeout: 800,
    response: ({ query }: { query: any }) => {
      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const densityId = query.densityId ? parseInt(query.densityId) : 1
      const total = 18

      const logs = []
      const startIndex = (page - 1) * pageSize
      const endIndex = Math.min(startIndex + pageSize, total)

      const levels = ['info', 'warning', 'error', 'debug']

      for (let i = startIndex + 1; i <= endIndex; i++) {
        const levelIndex = (i - 1) % levels.length

        logs.push({
          id: i,
          densityId,
          level: levels[levelIndex],
          message: Mock.Random.csentence(5, 15),
          timestamp: Mock.Random.datetime('2024-01-01 00:00:00', '2024-03-30 23:59:59'),
          data: Mock.Random.boolean()
            ? {
                reading: Mock.Random.float(1.0, 4.0, 2, 2),
                temperature: Mock.Random.float(20, 30, 2, 2),
                humidity: Mock.Random.float(40, 80, 2, 2),
              }
            : null,
        })
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          list: logs,
          total,
          page,
          pageSize,
        },
      }
    },
  },
]

// 合并所有mock配置
const mocks: MockMethod[] = [
  ...userMocks,
  ...suitMocks,
  ...orderMocks,
  ...processMocks,
  ...logMocks,
  ...dashboardMocks,
  ...v2Mocks,
]

export default mocks
