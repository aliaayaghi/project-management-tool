import { createRouter, createWebHistory } from 'vue-router'
import BoardDashboardPage from '../pages/BoardDashboardPage.vue'
import BoardDetailPage from '../pages/BoardDetailPage.vue'
import BoardSettingsPage from '../pages/BoardSettingsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'boards',
      component: BoardDashboardPage,
    },
    {
      path: '/boards/:boardId',
      name: 'board-detail',
      component: BoardDetailPage,
    },
    {
      path: '/boards/:boardId/settings',
      name: 'board-settings',
      component: BoardSettingsPage,
    },
  ],
})
