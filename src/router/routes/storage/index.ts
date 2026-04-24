import type { RouteRecordRaw } from 'vue-router'

const fiducialStorage: RouteRecordRaw = {
  path: 'fiducial',
  component: () => import('@/views/storage/fiducial/index.vue'),
  meta: {
    title: '基准档案管理',
    icon: 'Folder',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'StorageFiducial',
}

const taskStorage: RouteRecordRaw = {
  path: 'task',
  component: () => import('@/views/storage/task/index.vue'),
  meta: {
    title: '任务档案管理',
    icon: 'Folder',
    showInMenu: true,
    requiresAuth: true,
  },
  name: 'StorageTask',
}

export default {
  path: '/storage',
  redirect: '/storage/fiducial',
  meta: {
    title: '文件管理',
    icon: 'Folder',
    showInMenu: true,
    order: 3,
    requiresAuth: true,
  },
  name: 'Storage',
  children: [fiducialStorage, taskStorage],
} satisfies RouteRecordRaw
