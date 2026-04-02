import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 定义路由元数据接口
interface RouteMeta {
  title: string
  icon?: string
  showInMenu?: boolean
  breadcrumb?: string[]
  order?: number
  requiresAuth?: boolean
}

// 定义路由记录类型
type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta
  name?: string
  children?: AppRouteRecordRaw[]
}

const routes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      showInMenu: false,
      requiresAuth: false,
    },
    name: 'Login',
  },
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
      {
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
      },
      {
        path: '/workspace',
        component: () => import('@/layout/MainContent.vue'),
        redirect: '/workspace/suits',
        meta: {
          title: '工作空间',
          icon: 'Briefcase',
          showInMenu: true,
          order: 2,
          breadcrumb: ['工作空间'],
          requiresAuth: true,
        },
        name: 'Workspace',
        children: [
          {
            path: 'suits',
            component: () => import('@/views/workspace/SuitCard.vue'),
            meta: {
              title: '套单数据',
              icon: 'Tickets',
              showInMenu: true,
              order: 1,
              breadcrumb: ['工作空间', '套单数据'],
              requiresAuth: true,
            },
            name: 'WorkspaceSuits',
          },
          {
            path: 'processes',
            component: () => import('@/views/workspace/ProcessCard.vue'),
            meta: {
              title: '处理数据',
              icon: 'MessageBox',
              showInMenu: true,
              order: 2,
              breadcrumb: ['工作空间', '处理数据'],
              requiresAuth: true,
            },
            name: 'WorkspaceProcesses',
          },
          {
            path: 'xors',
            component: () => import('@/views/workspace/XorCard.vue'),
            meta: {
              title: 'LVL任务',
              icon: 'MessageBox',
              showInMenu: true,
              order: 3,
              breadcrumb: ['工作空间', 'LVL任务'],
              requiresAuth: true,
            },
            name: 'WorkspaceLVL',
          },
          {
            path: 'fractures',
            component: () => import('@/views/workspace/FractureCard.vue'),
            meta: {
              title: '转档任务',
              icon: 'MessageBox',
              showInMenu: true,
              order: 4,
              breadcrumb: ['工作空间', '转档任务'],
              requiresAuth: true,
            },
            name: 'WorkspaceFracture',
          },
          {
            path: 'mrcs',
            component: () => import('@/views/workspace/MrcCard.vue'),
            meta: {
              title: 'MRC任务',
              icon: 'MessageBox',
              showInMenu: true,
              order: 5,
              breadcrumb: ['工作空间', 'MRC任务'],
              requiresAuth: true,
            },
            name: 'WorkspaceMRC',
          },
          {
            path: 'densities',
            component: () => import('@/views/workspace/DensityCard.vue'),
            meta: {
              title: '透光率任务',
              icon: 'MessageBox',
              showInMenu: true,
              order: 6,
              breadcrumb: ['工作空间', '透光率任务'],
              requiresAuth: true,
            },
            name: 'WorkspaceDensity',
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 从localStorage检查用户登录状态
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  const isLoggedIn = !!(token && userInfo)

  const requiresAuth = to.meta.requiresAuth as boolean | undefined

  // 如果路由需要认证
  if (requiresAuth) {
    // 检查用户是否已登录
    if (isLoggedIn) {
      next()
    } else {
      // 未登录，重定向到登录页面
      next('/login')
    }
  } else if (to.path === '/login' && isLoggedIn) {
    // 如果用户已登录但访问登录页面，重定向到首页
    next('/')
  } else {
    // 不需要认证的路由，直接放行
    next()
  }
})

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title || 'AMSD'
})

export default router
