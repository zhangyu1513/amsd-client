import type { RouteRecordRaw } from 'vue-router'

const drawRoute: RouteRecordRaw = {
  path: 'draw',
  component: () => import('@/views/common/draw/index.vue'),
  meta: {
    title: '流程图工具',
    icon: 'EditPen',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'Draw',
}

export default {
  path: '/common',
  redirect: '/common/draw',
  meta: {
    title: '通用工具',
    icon: 'Tools',
    showInMenu: true,
    order: 3,
    requiresAuth: true,
  },
  children: [drawRoute],
} satisfies RouteRecordRaw
