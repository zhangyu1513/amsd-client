import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/401',
  component: () => import('@/views/status/401.vue'),
  meta: {
    title: '权限不足',
    showInMenu: false,
    requiresAuth: false,
  },
  name: '401',
} satisfies RouteRecordRaw
