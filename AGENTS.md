# AMSD Client - OpenCode 开发规则

## 项目概述

AMSD Client 是一个基于 Vue 3 的前端项目，用于套单管理业务系统。

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup lang="ts">`)
- **语言**: TypeScript (严格模式，禁止使用 `any`)
- **UI 库**: Element Plus
- **样式**: Tailwind CSS (仅用于布局和外边距)
- **状态管理**: Pinia
- **工具库**: dayjs, lodash-es, axios
- **包管理器**: yarn

## 样式冲突处理原则

1. **Element Plus 优先**: Tailwind CSS 与 Element Plus 冲突时，**必须保留 Element Plus 样式**
2. **Tailwind 使用限制**:
   - 用于外层容器布局 (`flex`, `p-4`, `gap-4`, `w-full`, `h-screen`), 优先写在标签内的class属性中
   - 禁止修改 Element Plus 组件内部样式
3. **Element Plus 使用方式**: 使用标签形式 (`<el-button>`) 而非组件形式 (`<ElButton>`)

## 项目主题

1. **暗黑模式**: 项目使用 Element Plus 官方提供的黑暗模式配置
2. **颜色原则**: 无论何种样式，都需要以匹配黑暗模式为主

## 常用命令

- `yarn build` - 构建生产版本
- `yarn type-check` - TypeScript 类型检查
- `yarn lint` - 代码检查
- `yarn format` - 代码格式化
