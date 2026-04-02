# AMSD Client

基于 Vue 3 + TypeScript + Element Plus + Tailwind CSS v4 的管理系统前端项目。

## 项目概述

本项目是 `/Users/zhangyu/projects/repos/ams-v3-client` 项目的复刻版本，按照 `.clinerules` 规范进行了重构和优化。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup lang="ts">`)
- **语言**: TypeScript (严格模式)
- **UI 库**: Element Plus (核心组件库)
- **样式**: Tailwind CSS v4 (仅用于布局和外边距)
- **状态管理**: Pinia
- **路由**: Vue Router 5
- **HTTP 客户端**: Axios
- **工具库**: dayjs, lodash-es, highlight.js
- **包管理器**: yarn

## 项目结构

```
src/
├── api/              # API 接口
│   └── index.ts     # Axios 配置和封装
├── assets/          # 静态资源
├── components/      # 公共组件
├── layout/          # 布局组件
│   └── index.vue   # 主布局
├── router/          # 路由配置
│   └── index.ts    # 路由定义
├── stores/          # 状态管理
│   ├── counter.ts  # 示例 store
│   └── user.ts     # 用户 store
├── utils/           # 工具函数
│   └── index.ts    # 工具函数集合
├── views/           # 页面组件
│   ├── dashboard/  # 仪表盘
│   └── workspace/  # 工作空间
│       ├── logs/   # 日志页面
│       ├── suits/  # 套单列表
│       ├── orders/ # 子单列表
│       └── processes/ # 处理任务
├── App.vue          # 根组件
├── main.ts          # 应用入口
└── main.css         # 全局样式
```

## 功能特性

### 已完成的功能
1. **完整的路由系统** - 包含仪表盘、工作空间、日志等页面
2. **响应式布局** - 侧边栏可折叠，适配移动端
3. **用户认证** - 用户登录、登出、权限管理
4. **数据管理** - 套单、子单、处理任务的CRUD操作
5. **日志系统** - 系统日志查看，支持JSON高亮显示
6. **API封装** - 统一的HTTP请求拦截和错误处理
7. **工具函数** - 日期格式化、文件下载、防抖节流等

### 页面说明
- **仪表盘** (`/dashboard`) - 系统概览和统计数据
- **工作空间** (`/workspace`) - 管理套单、子单和处理任务
- **日志** (`/log`) - 查看系统运行日志
- **套单列表** (`/workspace/suits`) - 套单管理
- **子单列表** (`/workspace/suits/:suit_id/orders`) - 子单管理
- **处理列表** (`/workspace/suits/:suit_id/processes`) - 处理任务管理

## 开发规范

### 代码风格
- 使用 `<script setup lang="ts">` 语法
- Props 和 Emits 必须使用 TypeScript 类型定义
- 禁止使用 `any` 类型
- 使用 Element Plus 组件时使用标签形式（如 `<el-button>`）

### 样式规范
- **Tailwind CSS** 仅用于外层容器布局
- **禁止**使用 Tailwind 修改 Element Plus 组件内部样式
- Element Plus 样式优先级高于 Tailwind CSS

### 错误处理
- 使用 Element Plus 的 `ElMessage` 或 `ElNotification` 处理操作反馈
- 异步操作必须包含 try-catch 块

## 开发命令

```bash
# 安装依赖
yarn install

# 开发模式
yarn dev

# 类型检查
yarn type-check

# 构建项目
yarn build

# 代码格式化
yarn format

# 代码检查
yarn lint
```

## 项目对比

### 源项目 (ams-v3-client)
- 使用 JavaScript
- 使用 Vue 3 + Element Plus + Tailwind CSS v4
- 基础的路由和组件结构

### 本项目 (amsd-client)
- 使用 **TypeScript**（严格模式）
- 完整的 **TypeScript 类型定义**
- 按照 `.clinerules` 规范开发
- 完善的 **代码质量工具**（eslint, prettier, oxlint, vue-tsc）
- 增强的 **错误处理** 和 **API 封装**
- 完整的 **用户认证系统**
- 更多的 **工具函数** 和 **最佳实践**

## 注意事项

1. 项目已通过 TypeScript 严格模式检查
2. 所有组件都使用 Composition API 和 `<script setup>` 语法
3. 遵循 Element Plus 和 Tailwind CSS 的样式冲突处理原则
4. 项目构建成功，可以正常运行

## 下一步计划

1. 添加更多业务组件
2. 实现图表组件（如 ECharts）
3. 添加单元测试
4. 优化打包体积（代码分割）
5. 添加国际化支持