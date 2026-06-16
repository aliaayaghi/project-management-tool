<script setup lang="ts">
import BoardCard from './BoardCard.vue'
import type { Board, UpdateBoardInput } from '../models/board'

defineProps<{
  boards: Board[]
  selectedBoardId: string | null
  emptyMessage?: string
  isFirstRun?: boolean
}>()

const emit = defineEmits<{
  select: [boardId: string]
  update: [boardId: string, input: UpdateBoardInput]
  delete: [boardId: string]
  
}>()


function selectBoard(boardId: string) {
  emit('select', boardId)
}

function updateBoard(boardId: string, input: UpdateBoardInput) {
  emit('update', boardId, input)
}

function deleteBoard(boardId: string) {
  emit('delete', boardId)
}
</script>

<template>
  <section class="board-list-view">
    <BoardCard
      v-for="board in boards"
      :key="board.id"
      :board="board"
      :is-selected="board.id === selectedBoardId"
      @select="selectBoard"
      @update="updateBoard"
      @delete="deleteBoard"
    />

    <div v-if="!boards.length && isFirstRun" class="board-list-view__welcome">
      <p class="board-list-view__welcome-heading">Welcome — let's build your first board.</p>
      <p class="board-list-view__welcome-body">
        Boards are your workspace. Each board holds lists (like columns) and cards (like tasks).
        Hit the <strong>+</strong> above to create one now.
      </p>
    </div>

    <p v-else-if="!boards.length && emptyMessage" class="board-list-view__empty">
      {{ emptyMessage }}
    </p>
  </section>
</template>

<style scoped>
.board-list-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.85rem;
}

.board-list-view__empty {
  margin: 0;
  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--card-muted);
  background: var(--card-bg);
}

.board-list-view__welcome {
  grid-column: 1 / -1;
  border: 1px dashed var(--clay);
  border-radius: 8px;
  padding: 1.5rem 1.75rem;
  background: var(--clay-soft);
}

.board-list-view__welcome-heading {
  margin: 0 0 0.5rem;
  color: var(--clay);
  font-size: 1.125rem;
  font-weight: 700;
}

.board-list-view__welcome-body {
  margin: 0;
  color: var(--card-muted);
  line-height: 1.6;
}

.board-list-view__welcome-body strong {
  color: var(--card-text);
  font-weight: 700;
}
</style>
