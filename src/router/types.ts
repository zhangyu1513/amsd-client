import type { RouteRecordRaw } from 'vue-router'

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta
  name?: string
  children?: AppRouteRecordRaw[]
}

export interface RouteMeta {
  title: string
  icon?: string
  showInMenu?: boolean
  breadcrumb?: string[]
  order?: number
  requiresAuth?: boolean
}
