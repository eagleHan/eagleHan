import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/counter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('../components/Layout.vue'),
      meta: { requiresAuth: true },
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: '仪表盘' }
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/UserManagement.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('../views/RoleManagement.vue'),
          meta: { title: '角色管理' }
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/SystemSettings.vue'),
          meta: { title: '系统设置' }
        }
      ]
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
