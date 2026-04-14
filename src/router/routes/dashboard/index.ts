import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '仪表盘',
    icon: 'Odometer',
    showInMenu: true,
    order: 1,
    requiresAuth: true,
  },
  name: 'Dashboard',
} satisfies RouteRecordRaw
