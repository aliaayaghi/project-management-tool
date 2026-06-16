<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BoardCreateForm from '../components/BoardCreateForm.vue'
import BoardListView from '../components/BoardListView.vue'
import { useProjectStore } from '../stores/projectStore'
import type { CreateBoardInput } from '../models/board'

const projectStore = useProjectStore()
const router = useRouter()
const showBoardForm = ref(false)
const boardSearchQuery = ref('')

const filteredBoards = computed(() => {
  const query = boardSearchQuery.value.trim().toLowerCase()

  if (!query) {
    return projectStore.boards
  }

  return projectStore.boards.filter((board) =>
    [board.title, board.description ?? '', board.visibility]
      .join(' ')
      .toLowerCase()
      .includes(query),
  )
})

onMounted(() => {
  projectStore.loadBoards()
})

async function createBoard(input: CreateBoardInput) {
  const board = await projectStore.createBoard(input)

  if (board) {
    showBoardForm.value = false
    router.push(`/boards/${board.id}`)
  }
}

function selectBoard(boardId: string) {
  router.push(`/boards/${boardId}`)
}

function toggleBoardForm() {
  showBoardForm.value = !showBoardForm.value
}
</script>

<template>
  <section class="dashboard-page">
    <div class="dashboard-page__toolbar">
      <div>
        <h2>Board dashboard</h2>
      </div>

      <button
        class="icon-button"
        type="button"
        :aria-label="showBoardForm ? 'Close board form' : 'Create board'"
        @click="toggleBoardForm"
      >
        {{ showBoardForm ? 'x' : '+' }}
      </button>
    </div>

    <BoardCreateForm v-if="showBoardForm" @create="createBoard" />

    <label class="dashboard-page__search">
      <span>Search boards</span>
      <input
        v-model="boardSearchQuery"
        type="search"
        placeholder="Filter by title, description, or visibility"
      />
    </label>

    <p v-if="projectStore.isLoading" class="status-message">
      Loading project data...
    </p>

    <p v-if="projectStore.errorMessage" class="error-message">
      {{ projectStore.errorMessage }}
    </p>

    <p class="dashboard-page__summary">
      {{ filteredBoards.length }} of {{ projectStore.boardCount }} boards
    </p>

    <BoardListView
      :boards="filteredBoards"
      :selected-board-id="null"
      :is-first-run="!projectStore.boards.length && !boardSearchQuery.trim()"
      :empty-message="
        boardSearchQuery.trim()
          ? 'No boards match your search.'
          : ''
      "
      @select="selectBoard"
      @update="projectStore.updateBoard"
      @delete="projectStore.deleteBoard"
    />
  </section>
</template>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 1.25rem;
}

.dashboard-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-page__summary {
  margin: 0;
  color: var(--accent);
  font-weight: 500;
}

.dashboard-page__search {
  display: grid;
  gap: 0.35rem;
  color: var(--card-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.dashboard-page__search input {
  min-height: 2.75rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.85rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.dashboard-page__search input:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

h2 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

@media (max-width: 760px) {
  .dashboard-page__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
