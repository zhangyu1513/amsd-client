import type { RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

export interface RouteMeta {
  title: string
  icon?: string
  showInMenu?: boolean
  breadcrumb?: string[]
  order?: number
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

export const createRouteGuard = (_to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  const isLoggedIn = !!(token && userInfo)

  const requiresAuth = (_to.meta.requiresAuth as boolean) ?? false
  const requiresAdmin = (_to.meta.requiresAdmin as boolean) ?? false

  if (requiresAdmin && !userStore.isAdmin()) {
    return '/401'
  }

  if (requiresAuth) {
    if (!isLoggedIn) {
      return '/login'
    }
  } else if (_to.path === '/login' && isLoggedIn) {
    return '/'
  }
}

export const afterEachHook = (to: RouteLocationNormalized) => {
  const title = (to.meta?.title as string) || 'AMSD'
  document.title = title
}
