<script setup lang="ts">
import { ref } from 'vue'

import type { Board, BoardVisibility, UpdateBoardInput } from '../models/board'

const props = defineProps<{
  board: Board
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [boardId: string]
  update: [boardId: string, input: UpdateBoardInput]
  delete: [boardId: string]
}>()

const isEditing = ref(false)
const title = ref(props.board.title)
const description = ref(props.board.description ?? '')
const visibility = ref<BoardVisibility>(props.board.visibility)
const titleError = ref('')

function selectBoard() {
  if (isEditing.value) {
    return
  }

  emit('select', props.board.id)
}

function startEditing() {
  title.value = props.board.title
  description.value = props.board.description ?? ''
  visibility.value = props.board.visibility
  titleError.value = ''
  isEditing.value = true
}

function cancelEditing() {
  titleError.value = ''
  isEditing.value = false
}

function submitUpdate() {
  const trimmedTitle = title.value.trim()
  const trimmedDescription = description.value.trim()

  titleError.value = ''

  if (!trimmedTitle) {
    titleError.value = 'Board title is required.'
    return
  }

  emit('update', props.board.id, {
    title: trimmedTitle,
    description: trimmedDescription || undefined,
    visibility: visibility.value,
  })

  isEditing.value = false
}

function deleteBoard() {
  emit('delete', props.board.id)
}
</script>

<template>
  <article class="board-card" :class="{ 'board-card--selected': isSelected }" @click="selectBoard">
    <form v-if="isEditing" class="board-card__form" @click.stop @submit.prevent="submitUpdate">
      <label class="board-card__group">
        <span>Board title</span>
        <input
          v-model="title"
          class="board-card__field"
          type="text"
          :aria-invalid="Boolean(titleError)"
          :aria-describedby="`edit-board-title-error-${board.id}`"
        />
        <span
          v-if="titleError"
          :id="`edit-board-title-error-${board.id}`"
          class="board-card__error"
        >
          {{ titleError }}
        </span>
      </label>

      <label class="board-card__group">
        <span>Description</span>
        <input v-model="description" class="board-card__field" type="text" />
      </label>

      <label class="board-card__group">
        <span>Visibility</span>
        <select v-model="visibility" class="board-card__field">
          <option value="private">Private</option>
          <option value="shared">Shared</option>
        </select>
      </label>

      <div class="board-card__actions">
        <button class="board-card__button" type="submit">Save</button>
        <button class="board-card__button" type="button" @click="cancelEditing">Cancel</button>
      </div>
    </form>

    <template v-else>
      <div class="board-card__topline">
        <p class="board-card__visibility">{{ board.visibility }}</p>
        <div class="board-card__actions" @click.stop>
          <button class="board-card__button" type="button" @click="startEditing">Edit</button>
          <button class="board-card__button board-card__button--danger" type="button" @click="deleteBoard">
            Delete
          </button>
        </div>
      </div>

      <h2 class="board-card__title">{{ board.title }}</h2>
      <p v-if="board.description" class="board-card__description">
        {{ board.description }}
      </p>
    </template>
  </article>
</template>

<style scoped>
.board-card {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--card-bg);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.board-card:hover {
  border-color: var(--accent);
}

.board-card__visibility {
  margin: 0;
  color: var(--accent);
  font-size: 0.85rem;
  text-transform: uppercase;
}

.board-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.board-card__form {
  display: grid;
  gap: 0.5rem;
}

.board-card__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.82rem;
  font-weight: 800;
}

.board-card__field {
  min-height: 2.25rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.board-card__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.board-card__error {
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 800;
}

.board-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.board-card__button {
  min-height: 2rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.6rem;
  background: var(--card-bg);
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 800;
}

.board-card__button--danger {
  color: #a33434;
}

.board-card__title {
  margin: 0;
  color: var(--card-text);
  font-size: 1.25rem;
}

.board-card__description {
  margin: 0.5rem 0 0;
  color: var(--card-muted);
}

.board-card--selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
</style>
