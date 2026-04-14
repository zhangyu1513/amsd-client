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

const mindmapRoute: RouteRecordRaw = {
  path: 'mindmap',
  component: () => import('@/views/common/mindmap/index.vue'),
  meta: {
    title: '思维导图',
    icon: 'Connection',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'MindMap',
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
  children: [drawRoute, mindmapRoute],
} satisfies RouteRecordRaw
