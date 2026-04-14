import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { createRouteGuard, afterEachHook } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

router.beforeEach(createRouteGuard)
router.afterEach(afterEachHook)

export default router
