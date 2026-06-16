<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { BoardVisibility } from '../models/board'
import { useProjectStore } from '../stores/projectStore'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const boardId = computed(() => route.params.boardId as string)
const board = computed(() => projectStore.getBoard(boardId.value))
const title = ref('')
const description = ref('')
const visibility = ref<BoardVisibility>('private')
const isConfirmingDelete = ref(false)

onMounted(async () => {
  if (!projectStore.boards.length) {
    await projectStore.loadBoards()
  }

  syncFormWithBoard()
})

watch(board, () => {
  syncFormWithBoard()
})

async function submitSettings() {
  const trimmedTitle = title.value.trim()
  const trimmedDescription = description.value.trim()

  if (!board.value || !trimmedTitle) {
    return
  }

  await projectStore.updateBoard(board.value.id, {
    title: trimmedTitle,
    description: trimmedDescription || undefined,
    visibility: visibility.value,
  })
}

function confirmDelete() {
  isConfirmingDelete.value = true
}

function cancelDelete() {
  isConfirmingDelete.value = false
}

async function deleteBoard() {
  if (!board.value) {
    return
  }

  await projectStore.deleteBoard(board.value.id)
  router.push('/')
}

function syncFormWithBoard() {
  if (!board.value) {
    return
  }

  title.value = board.value.title
  description.value = board.value.description ?? ''
  visibility.value = board.value.visibility
}
</script>

<template>
  <section class="settings-page">
    <nav class="settings-page__nav" aria-label="Board navigation">
      <RouterLink to="/">All boards</RouterLink>
      <RouterLink :to="`/boards/${boardId}`">Board</RouterLink>
    </nav>

    <p v-if="projectStore.isLoading" class="status-message">
      Loading board settings...
    </p>

    <p v-if="projectStore.errorMessage" class="error-message">
      {{ projectStore.errorMessage }}
    </p>

    <div v-if="board" class="settings-page__layout">
      <form class="settings-page__panel" @submit.prevent="submitSettings">
        <h2>{{ board.title }}</h2>

        <label class="settings-page__field">
          <span>Title</span>
          <input v-model="title" type="text" />
        </label>

        <label class="settings-page__field">
          <span>Description</span>
          <textarea v-model="description" rows="4" />
        </label>

        <label class="settings-page__field">
          <span>Visibility</span>
          <select v-model="visibility">
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
        </label>

        <div class="settings-page__actions">
          <button class="settings-page__button" type="submit">
            Save changes
          </button>
          <button
            class="settings-page__button settings-page__button--secondary"
            type="button"
            @click="syncFormWithBoard"
          >
            Reset
          </button>
        </div>
      </form>

      <aside class="settings-page__panel">
        <dl>
          <div>
            <dt>Visibility</dt>
            <dd>{{ board.visibility }}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{{ projectStore.currentUser?.name }}</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>
              {{
                board.visibility === 'shared'
                  ? 'Anyone with access can collaborate.'
                  : 'Only the owner can access this board.'
              }}
            </dd>
          </div>
        </dl>
      </aside>

      <section class="settings-page__panel settings-page__panel--danger">
        <h2>Delete board</h2>
        <p>
          Deleting this board permanently removes all its lists and cards.
        </p>
        <div v-if="isConfirmingDelete" class="settings-page__actions">
          <p class="settings-page__confirm-text">This cannot be undone. Are you sure?</p>
          <button
            class="settings-page__button settings-page__button--danger"
            type="button"
            @click="deleteBoard"
          >
            Yes, delete board
          </button>
          <button
            class="settings-page__button settings-page__button--secondary"
            type="button"
            @click="cancelDelete"
          >
            Cancel
          </button>
        </div>
        <div v-else class="settings-page__actions">
          <button
            class="settings-page__button settings-page__button--danger"
            type="button"
            @click="confirmDelete"
          >
            Delete board
          </button>
        </div>
      </section>
    </div>

    <p v-else class="settings-page__empty">
      This board could not be found.
    </p>
  </section>
</template>

<style scoped>
.settings-page {
  display: grid;
  gap: 1rem;
}

.settings-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.8fr);
  gap: 1rem;
}

.settings-page__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.settings-page__nav a {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  background: var(--card-bg);
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.15s ease;
}

.settings-page__nav a:hover {
  border-color: var(--accent);
}

.settings-page__nav a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.settings-page__panel,
.settings-page__empty {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--card-bg);
  color: var(--card-text);
}

.settings-page__panel {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.settings-page__panel--danger {
  grid-column: 1 / -1;
  border-color: var(--danger);
}

h2 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.settings-page__field {
  display: grid;
  gap: 0.35rem;
}

.settings-page__field span {
  color: var(--card-muted);
  font-weight: 600;
}

.settings-page__field input,
.settings-page__field textarea,
.settings-page__field select {
  width: 100%;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.75rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.settings-page__field input,
.settings-page__field select {
  min-height: 2.75rem;
}

.settings-page__field textarea {
  resize: vertical;
}

.settings-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.settings-page__button {
  min-height: 2.75rem;
  border: 1px solid var(--clay);
  border-radius: 8px;
  padding: 0 0.9rem;
  background: var(--clay);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.settings-page__button:hover {
  background: var(--clay-hover);
  border-color: var(--clay-hover);
}

.settings-page__button:focus-visible {
  outline: 2px solid var(--clay);
  outline-offset: 2px;
}

.settings-page__button--secondary {
  border-color: var(--card-border);
  background: var(--card-bg);
  color: var(--accent);
  transition: border-color 0.15s ease;
}

.settings-page__button--secondary:hover {
  border-color: var(--accent);
}

.settings-page__button--danger {
  border-color: var(--danger);
  background: var(--danger);
}

.settings-page__panel p {
  margin: 0;
  color: var(--card-muted);
}

dl {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

dl div {
  display: grid;
  gap: 0.15rem;
}

dt {
  color: var(--card-muted);
  font-weight: 600;
}

dd {
  margin: 0;
  color: var(--card-text);
  font-weight: 700;
}

.settings-page__confirm-text {
  margin: 0;
  color: var(--danger);
  font-weight: 500;
}

.settings-page__empty {
  margin: 0;
  color: var(--card-muted);
}

@media (max-width: 760px) {
  .settings-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
