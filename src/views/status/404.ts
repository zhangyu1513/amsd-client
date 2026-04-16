import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/:pathMatch(.*)*',
  component: () => import('@/views/status/404.vue'),
  meta: {
    title: '页面不存在',
    showInMenu: false,
    requiresAuth: false,
  },
  name: '404',
} satisfies RouteRecordRaw
