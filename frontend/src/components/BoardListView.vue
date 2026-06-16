<script setup lang="ts">
import BoardCard from './BoardCard.vue'
import type { Board, UpdateBoardInput } from '../models/board'

defineProps<{
  boards: Board[]
  selectedBoardId: string | null
  emptyMessage?: string
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

    <p v-if="!boards.length" class="board-list-view__empty">
      {{ emptyMessage ?? 'No boards yet. Create your first board above.' }}
    </p>
  </section>
</template>

<style scoped>
.board-list-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.board-list-view__empty {
  margin: 0;
  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--card-muted);
  background: var(--card-bg);
}
</style>
