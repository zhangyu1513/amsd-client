import type { RouteRecordRaw } from 'vue-router'

const commonRoute: RouteRecordRaw = {
  path: 'common',
  component: () => import('@/views/tooling/common.vue'),
  meta: {
    title: '通用解析',
    icon: 'EditPen',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'ParseCommonTooling',
}

export default {
  path: '/tooling',
  redirect: '/tooling/common',
  meta: {
    title: 'Tooling解析',
    icon: 'Tools',
    showInMenu: true,
    order: 3,
    requiresAuth: true,
  },
  children: [commonRoute],
} satisfies RouteRecordRaw
