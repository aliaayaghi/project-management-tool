<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

type ThemeMode = 'light' | 'dark'

const themeMode = ref<ThemeMode>('light')

function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
}
</script>


<template>
  <main class="app-shell" :class="`app-shell--${themeMode}`">
    <header class="app-header">
      <RouterLink class="app-title" to="/">
        <p class="app-eyebrow">Project management</p>
        <h1>Boards</h1>
      </RouterLink>

      <div class="app-actions">
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
  --board-bg: #f0ebe3;
  --column-bg: #e8e2d9;
  --card-bg: #ffffff;
  --card-border: #d8d0c4;
  --card-text: #1a2030;
  --card-muted: #4f463d;
  --empty-text: #6d6258;
  --accent: #2e5070;
  --accent-soft: #daeaf5;
  --accent-hover: #25425c;

  min-height: 100vh;
  padding: 2rem;
  background: var(--board-bg);
}

.app-shell--dark {
  --board-bg: #1a2030;
  --column-bg: #202838;
  --card-bg: #252e40;
  --card-border: #2e3a52;
  --card-text: #c0d4e8;
  --card-muted: #c0d4e8;
  --empty-text: #c0d4e8;
  --accent: #5b7fa6;
  --accent-soft: rgba(91, 127, 166, 0.35);
  --accent-hover: #6f93ba;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.theme-button {
  min-height: 2.75rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  padding: 0 1rem;
  background: var(--card-bg);
  color: var(--card-text);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.app-eyebrow {
  margin: 0 0 0.25rem;
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--card-text);
  font-size: 2rem;
  font-weight: 700;
}

.selected-board {
  margin: 0 0 1rem;
  color: var(--accent);
  font-weight: 700;
}

.status-message,
.error-message {
  margin: 0 0 1rem;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-weight: 700;
}

.status-message {
  background: var(--accent-soft);
  color: var(--accent);
}

.error-message {
  border: 1px solid #a33434;
  background: #f9dddd;
  color: #7b2020;
}

@media (max-width: 760px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
