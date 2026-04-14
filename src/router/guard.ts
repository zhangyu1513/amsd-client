import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export interface RouteMeta {
  title: string
  icon?: string
  showInMenu?: boolean
  breadcrumb?: string[]
  order?: number
  requiresAuth?: boolean
}

export const createRouteGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  const isLoggedIn = !!(token && userInfo)

  const requiresAuth = (to.meta.requiresAuth as boolean) ?? false

  if (requiresAuth) {
    if (isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
}

export const afterEachHook = (to: RouteLocationNormalized) => {
  const title = (to.meta?.title as string) || 'AMSD'
  document.title = title
}
