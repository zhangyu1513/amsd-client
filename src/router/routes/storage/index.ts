import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/storage',
  component: () => import('@/views/storage/index.vue'),
  meta: {
    title: '文件管理',
    icon: 'Folder',
    showInMenu: true,
    order: 3,
    requiresAuth: true,
  },
  name: 'Storage',
} satisfies RouteRecordRaw
