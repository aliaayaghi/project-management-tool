<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BoardCreateForm from '../components/BoardCreateForm.vue'
import BoardListView from '../components/BoardListView.vue'
import { useProjectStore } from '../stores/projectStore'
import type { CreateBoardInput } from '../models/board'

const projectStore = useProjectStore()
const router = useRouter()
const showBoardForm = ref(false)

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
        <p class="dashboard-page__eyebrow">
          {{ projectStore.currentUser.name }}
        </p>
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

    <p v-if="projectStore.isLoading" class="status-message">
      Loading project data...
    </p>

    <p v-if="projectStore.errorMessage" class="error-message">
      {{ projectStore.errorMessage }}
    </p>

    <p class="dashboard-page__summary">
      {{ projectStore.boardCount }} boards
    </p>

    <BoardListView
      :boards="projectStore.boards"
      :selected-board-id="null"
      @select="selectBoard"
      @update="projectStore.updateBoard"
      @delete="projectStore.deleteBoard"
    />
  </section>
</template>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 1rem;
}

.dashboard-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-page__eyebrow,
.dashboard-page__summary {
  margin: 0;
  color: var(--accent);
  font-weight: 800;
}

h2 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.5rem;
  font-weight: 800;
}

@media (max-width: 760px) {
  .dashboard-page__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
