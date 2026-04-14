import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/workspace',
  component: () => import('@/views/workspace/index.vue'),
  meta: {
    title: '工作空间',
    icon: 'Briefcase',
    showInMenu: true,
    order: 2,
    requiresAuth: true,
  },
  name: 'Workspace',
} satisfies RouteRecordRaw
