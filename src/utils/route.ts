import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'

// 菜单项接口
export interface MenuItem {
  path: string
  title: string
  icon?: string
  order?: number
  children?: MenuItem[]
}

// 从路由配置中提取菜单项
export function getMenuItems(): MenuItem[] {
  const routes = router.getRoutes()
  const menuItems: MenuItem[] = []
  
  // 找到根路由（path为'/'的路由）
  const rootRoute = routes.find(route => route.path === '/')
  if (!rootRoute || !rootRoute.children) {
    return menuItems
  }
  
  // 处理子路由
  rootRoute.children.forEach(route => {
    // 检查是否应该显示在菜单中
    if (route.meta?.showInMenu !== false && route.meta?.title) {
      const menuItem: MenuItem = {
        path: route.path,
        title: route.meta.title as string,
        icon: route.meta.icon as string,
        order: route.meta.order as number || 999
      }
      
      // 如果有子路由，递归处理
      if (route.children && route.children.length > 0) {
        const childMenuItems: MenuItem[] = []
        route.children.forEach(childRoute => {
          if (childRoute.meta?.showInMenu !== false && childRoute.meta?.title) {
            // 构建完整的子路由路径
            const fullPath = route.path === '/' ? `/${childRoute.path}` : `${route.path}/${childRoute.path}`
            childMenuItems.push({
              path: fullPath,
              title: childRoute.meta.title as string,
              icon: childRoute.meta.icon as string,
              order: childRoute.meta.order as number || 999
            })
          }
        })
        
        // 按order排序子菜单项
        if (childMenuItems.length > 0) {
          menuItem.children = childMenuItems.sort((a, b) => (a.order || 999) - (b.order || 999))
        }
      }
      
      menuItems.push(menuItem)
    }
  })
  
  // 按order排序菜单项
  return menuItems.sort((a, b) => (a.order || 999) - (b.order || 999))
}

// 获取面包屑路径
export function getBreadcrumbItems(path: string): string[] {
  const matchedRoutes = router.resolve(path).matched
  
  const breadcrumbItems: string[] = []
  
  // 总是添加首页作为第一个面包屑
  breadcrumbItems.push('首页')
  
  // 遍历匹配的路由，添加面包屑
  matchedRoutes.forEach(route => {
    // 跳过根路由和没有标题的路由
    if (route.path === '/' || !route.meta?.title) {
      return
    }
    
    // 如果路由有自定义的面包屑配置，使用它
    if (route.meta?.breadcrumb) {
      // 只添加自定义面包屑中尚未存在的项
      const customBreadcrumbs = route.meta.breadcrumb as string[]
      customBreadcrumbs.forEach(item => {
        if (!breadcrumbItems.includes(item)) {
          breadcrumbItems.push(item)
        }
      })
    } else if (route.meta?.title) {
      // 否则使用路由标题
      const title = route.meta.title as string
      if (!breadcrumbItems.includes(title)) {
        breadcrumbItems.push(title)
      }
    }
  })
  
  return breadcrumbItems
}
