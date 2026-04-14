import type { RouteRecordRaw } from 'vue-router'

import dashboardRoutes from './dashboard'
import workspaceRoutes from './workspace'
import commonRoutes from './common'
import loginRoutes from './login'

export const constantRoutes: RouteRecordRaw[] = [
  loginRoutes,
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '首页',
      showInMenu: false,
      requiresAuth: true,
    },
    children: [dashboardRoutes, workspaceRoutes, commonRoutes],
  },
]
