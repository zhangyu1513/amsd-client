import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
    showInMenu: false,
    requiresAuth: false,
  },
  name: 'Login',
} satisfies RouteRecordRaw
