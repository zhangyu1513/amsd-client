import dashboardRoutes from './dashboard'
import workspaceRoutes from './workspace'
import commonRoutes from './common'
import loginRoutes from './login'
import adminRoutes from './admin'
import storageRoutes from './storage'

import toolingRoutes from './tooling'

import status401 from '@/views/status/401'
import status404 from '@/views/status/404'

export const constantRoutes = [
  loginRoutes,
  status401,
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '首页',
      showInMenu: false,
      requiresAuth: true,
    },
    children: [
      dashboardRoutes,
      workspaceRoutes,
      toolingRoutes,
      commonRoutes,
      adminRoutes,
      storageRoutes,
    ],
  },
  status404,
]
