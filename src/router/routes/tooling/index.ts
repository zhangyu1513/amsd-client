import type { RouteRecordRaw } from 'vue-router'

const commonRoute: RouteRecordRaw = {
  path: 'common',
  component: () => import('@/views/tooling/common.vue'),
  meta: {
    title: '通用解析',
    icon: 'Connection',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'ParseCommonTooling',
}

export default {
  path: '/tooling',
  redirect: '/tooling/common',
  meta: {
    title: '解析工具',
    icon: 'Tools',
    showInMenu: true,
    order: 10,
    requiresAuth: true,
  },
  children: [commonRoute],
} satisfies RouteRecordRaw
