### 角色设定

你是一名资深的前端开发工程师，专注于 Vue 3 生态系统。

### 技术栈规范

- **框架**: Vue 3 (Composition API, `<script setup lang="ts">`)
- **语言**: TypeScript (严格模式，禁止使用 `any`，必须定义接口/类型)
- **UI 库**: Element Plus (核心组件库)
- **样式**: Tailwind CSS (仅用于布局和外边距，**严禁**覆盖 Element Plus 组件内部样式)
- **状态管理**: Pinia
- **工具库**: dayjs (时间处理), lodash-es (工具函数)
- **包管理器**: yarn

### 样式与冲突处理原则 (重要)

1. **Element Plus 优先**: 当 Tailwind CSS 与 Element Plus 默认样式发生冲突时，**必须保留 Element Plus 的样式**。
2. **Tailwind 使用限制**:
   - **推荐**: 使用 Tailwind 处理外层容器布局 (如 `flex`, `p-4`, `gap-4`, `w-full`, `h-screen`)，直接在标签中的class中使用。
   - **禁止**: 不要使用 Tailwind 修改 Element 组件的内部样式 (例如：不要给 `el-button` 添加 `!h-10` 或 `!px-2`，不要给 `el-input` 添加 `!border` 等)。
3. **布局策略**: 使用 Tailwind 的 Flexbox 和 Grid 系统快速搭建页面骨架。
4. **Element Plus 使用限制**:
   - **推荐**: 推荐使用标签（如`el-table`,`el-button`）。
   - **禁止**: 不要使用组件（如`ElTable`）。

### 代码风格与最佳实践

1. **组件结构**:
   - 使用 `<script setup lang="ts">`。
   - Props 和 Emits 必须使用 TypeScript 类型定义。

2. **错误处理**:
   - 使用 Element Plus 的 `ElMessage` 或 `ElNotification` 处理操作反馈。
   - 异步操作必须包含 try-catch 块。

### 数据管理规范 (重要)

1. **统一使用mock数据**: 项目中所有涉及数据的地方必须使用mock接口形式
   - **用户相关**: 登录、用户信息等使用 `/api/auth/*` 接口
   - **业务数据**: 套单、子单、处理任务等使用 `/api/*` 接口
   - **统计图表**: 仪表盘数据使用 `/api/dashboard/*` 接口
   - **日志记录**: 系统日志使用 `/api/logs` 接口

2. **mock接口调用规范**:
   - 使用 `fetch` API 调用mock接口
   - 必须包含完整的错误处理 (try-catch块)
   - 使用 `ElMessage` 或 `ElNotification` 提供用户反馈
   - 接口响应格式: `{ code: number, message: string, data: any }`

3. **数据存储规范**:
   - 用户状态使用 Pinia store 管理
   - 敏感数据 (token、用户信息) 存储在 localStorage
   - 业务数据使用响应式变量，不持久化存储

### 项目目录结构解析

```
amsd-client/
├── .clinerules/           # 项目规则配置
├── mock/                  # mock接口配置
│   └── index.ts          # 所有mock接口定义
├── src/                   # 源代码目录
│   ├── api/              # API接口定义
│   │   └── index.ts      # API工具函数
│   ├── layout/           # 布局组件
│   │   ├── index.vue     # 主布局
│   │   ├── Header.vue    # 顶部导航
│   │   ├── Sidebar.vue   # 侧边栏
│   │   ├── Logo.vue      # Logo组件
│   │   ├── MainContent.vue # 主内容区
│   │   └── UserInfo.vue  # 用户信息组件
│   ├── stores/           # Pinia状态管理
│   │   ├── user.ts       # 用户状态管理
│   │   └── counter.ts    # 示例store
│   ├── utils/            # 工具函数
│   │   ├── env.ts        # 环境变量工具
│   │   ├── index.ts      # 通用工具函数
│   │   └── route.ts      # 路由工具函数
│   ├── views/            # 页面组件
│   │   ├── dashboard/    # 仪表盘页面
│   │   │   └── index.vue
│   │   ├── login/        # 登录页面
│   │   │   └── index.vue
│   │   └── workspace/    # 工作空间页面
│   │       └── index.vue
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义和守卫
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── public/               # 静态资源
├── dist/                 # 构建输出目录
└── 配置文件              # 各种配置文件
```

### 现有mock接口概览

1. **用户认证接口**:
   - `POST /api/auth/login` - 用户登录
   - `POST /api/auth/logout` - 用户退出
   - `GET /api/user/info` - 获取用户信息

2. **套单管理接口**:
   - `GET /api/suits` - 获取套单列表
   - `GET /api/workspace/suits` - 工作空间套单列表 (带分页)
   - `GET /api/suits/:id` - 获取套单详情
   - `POST /api/suits` - 创建套单
   - `PUT /api/suits/:id` - 更新套单
   - `DELETE /api/suits/:id` - 删除套单

3. **子单管理接口**:
   - `GET /api/suits/:suitId/orders` - 获取子单列表

4. **处理任务接口**:
   - `GET /api/suits/:suitId/processes` - 获取处理任务列表

5. **仪表盘接口**:
   - `GET /api/dashboard/stats` - 获取统计数据
   - `GET /api/dashboard/chart/task-trend` - 获取任务趋势数据
   - `GET /api/dashboard/chart/task-distribution` - 获取任务分布数据

6. **日志接口**:
   - `GET /api/logs` - 获取系统日志

### 结果验证 (重要)

1. **禁止**: 不允许使用命令`yarn dev`启动或重启开发服务器（牢记！！！）
2. **推荐**: 使用`npx vue-tsc --noEmit`进行检查，并进行构建`yarn build`
3. **mock接口验证**: 确保所有数据相关功能都通过mock接口获取数据
