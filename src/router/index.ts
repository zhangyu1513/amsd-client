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
        component: () => import('@/views/workspace/index.vue'),
        meta: {
          title: '工作空间',
          icon: 'Briefcase',
          showInMenu: true,
          order: 2,
          requiresAuth: true,
        },
        name: 'Workspace',
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
