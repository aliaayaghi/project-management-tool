<script setup lang="ts">
import { ref } from 'vue'
import type { BoardVisibility, CreateBoardInput } from '../models/board'

const title = ref('')
const description = ref('')
const visibility = ref<BoardVisibility>('private')

const emit = defineEmits<{
  create: [
    board: CreateBoardInput
  ]
}>()

function submitForm() {
  if (!title.value.trim()) {
    return
  }

  emit('create', {
    title: title.value,
    description: description.value || undefined,
    visibility: visibility.value,
  })

  title.value = ''
  description.value = ''
  visibility.value = 'private'
}
</script>

<template>
  <form class="board-create-form" @submit.prevent="submitForm">
    <input
      v-model="title"
      class="board-create-form__field"
      type="text"
      placeholder="Board title"
    />

    <input
      v-model="description"
      class="board-create-form__field"
      type="text"
      placeholder="Description"
    />

    <select v-model="visibility" class="board-create-form__field">
      <option value="private">Private</option>
      <option value="shared">Shared</option>
    </select>

    <button class="board-create-form__button" type="submit">
      Create board
    </button>
  </form>
</template>

<style scoped>
.board-create-form {
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) minmax(12rem, 1.5fr) 10rem auto;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.board-create-form__field {
  min-height: 2.75rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.85rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.board-create-form__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.board-create-form__button {
  min-height: 2.75rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 0 1rem;
  background: var(--accent);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.board-create-form__button:hover {
  background: var(--accent-hover);
}

@media (max-width: 760px) {
  .board-create-form {
    grid-template-columns: 1fr;
  }
}
</style>
