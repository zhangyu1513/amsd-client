import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/admin',
  meta: {
    title: '系统管理',
    icon: 'Setting',
    showInMenu: true,
    order: 100,
    requiresAuth: true,
    requiresAdmin: true,
  },
  name: 'Admin',
  children: [
    {
      path: 'users',
      component: () => import('@/views/admin/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'User',
        showInMenu: true,
        order: 1,
      },
    },
    {
      path: 'roles',
      component: () => import('@/views/admin/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'UserFilled',
        showInMenu: true,
        order: 2,
      },
    },
    {
      path: 'permissions',
      component: () => import('@/views/admin/permission/index.vue'),
      meta: {
        title: '权限管理',
        icon: 'Key',
        showInMenu: true,
        order: 3,
      },
    },
    {
      path: 'login-logs',
      component: () => import('@/views/admin/login-log/index.vue'),
      meta: {
        title: '登录日志',
        icon: 'Clock',
        showInMenu: true,
        order: 4,
      },
    },
  ],
} satisfies RouteRecordRaw
