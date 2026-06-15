import { createRouter, createWebHistory } from 'vue-router'
import BoardDashboardPage from '../pages/BoardDashboardPage.vue'
import BoardDetailPage from '../pages/BoardDetailPage.vue'
import BoardSettingsPage from '../pages/BoardSettingsPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import { useAuthStore } from '../stores/authStore'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'boards',
      component: BoardDashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/boards/:boardId',
      name: 'board-detail',
      component: BoardDetailPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/boards/:boardId/settings',
      name: 'board-settings',
      component: BoardSettingsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { guestOnly: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/'
  }
})
