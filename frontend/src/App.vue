<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

type ThemeMode = 'light' | 'dark'

const themeMode = ref<ThemeMode>('light')
const authStore = useAuthStore()
const router = useRouter()

function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>


<template>
  <main class="app-shell" :class="`app-shell--${themeMode}`">
    <header class="app-header">
      <RouterLink class="app-title" to="/">
        <h1>Boards</h1>
      </RouterLink>

      <div class="app-actions">
        <span v-if="authStore.user" class="app-user">
          {{ authStore.user.name }}
        </span>

        <button
          v-if="authStore.isAuthenticated"
          class="theme-button"
          type="button"
          @click="logout"
        >
          Log out
        </button>

        <button class="theme-button" type="button" @click="toggleTheme">
          {{ themeMode === 'light' ? 'Dark' : 'Light' }}
        </button>
      </div>
    </header>

    <RouterView />
  </main>
</template>

<style scoped>
.app-shell {
  --board-bg: #f6f3ef;
  --column-bg: #edeae5;
  --card-bg: #ffffff;
  --card-border: #d8d0c4;
  --card-text: #1a2030;
  --card-muted: #4f463d;
  --empty-text: #5e5348;
  --accent: #2e5070;
  --accent-soft: #daeaf5;
  --accent-hover: #25425c;
  --clay: #9e5530;
  --clay-hover: #884928;
  --clay-soft: #faeae0;
  --danger: #a33434;
  --danger-soft: #f9dddd;
  --status-todo-text: #2e5070;
  --status-todo-fill: #daeaf5;
  --status-progress-text: #8a4030;
  --status-progress-fill: #f5e0d8;
  --status-done-text: #3d5c28;
  --status-done-fill: #dff0d4;

  min-height: 100vh;
  min-width: fit-content;
  padding: 1.25rem 1.5rem;
  background: var(--board-bg);
}

.app-shell--dark {
  --board-bg: #141b28;
  --column-bg: #1c2538;
  --card-bg: #263044;
  --card-border: #3a5070;
  --card-text: #d8eaf8;
  --card-muted: #9ab4cc;
  --empty-text: #d8eaf8;
  --accent: #74b8ea;
  --accent-soft: rgba(116, 184, 234, 0.2);
  --accent-hover: #90ccf8;
  --clay: #c46838;
  --clay-hover: #d47840;
  --clay-soft: rgba(196, 104, 56, 0.2);
  --danger: #f09090;
  --danger-soft: rgba(240, 144, 144, 0.15);
  --status-todo-text: #7ec8f4;
  --status-todo-fill: rgba(126, 200, 244, 0.2);
  --status-progress-text: #ec9878;
  --status-progress-fill: rgba(236, 152, 120, 0.2);
  --status-done-text: #7ed47a;
  --status-done-fill: rgba(126, 212, 122, 0.2);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.app-title {
  color: inherit;
  text-decoration: none;
}

.app-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--clay);
  border-radius: 999px;
  background: var(--clay);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.icon-button:hover {
  background: var(--clay-hover);
  border-color: var(--clay-hover);
}

.icon-button:focus-visible {
  outline: 2px solid var(--clay);
  outline-offset: 3px;
}

.theme-button {
  min-height: 2.25rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  padding: 0 1rem;
  background: var(--card-bg);
  color: var(--card-text);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.theme-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.app-user {
  color: var(--card-text);
  font-weight: 600;
}

h1 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.status-message,
.error-message {
  margin: 0 0 1rem;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-weight: 500;
}

.status-message {
  background: var(--accent-soft);
  color: var(--accent);
}

.error-message {
  border: 1px solid var(--danger);
  background: var(--danger-soft);
  color: var(--danger);
}

@media (max-width: 760px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .app-shell {
    padding: 1.25rem;
  }
}
</style>
