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
const isConfirmingDelete = ref(false)
const isMenuOpen = ref(false)
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

function confirmDelete() {
  isConfirmingDelete.value = true
}

function cancelDelete() {
  isConfirmingDelete.value = false
}

function deleteBoard() {
  emit('delete', props.board.id)
  isConfirmingDelete.value = false
}
</script>

<template>
  <article
    class="board-card"
    :class="{ 'board-card--selected': isSelected }"
    tabindex="0"
    role="button"
    :aria-pressed="isSelected"
    @click="selectBoard"
    @keydown.enter.prevent="selectBoard"
    @keydown.space.prevent="selectBoard"
  >
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
        <div class="board-card__menu">
          <div v-if="isMenuOpen" class="board-card__menu-backdrop" @click="isMenuOpen = false" />
          <button
            class="board-card__menu-trigger"
            type="button"
            :aria-label="`Options for ${board.title}`"
            @click.stop="isMenuOpen = !isMenuOpen"
          >⋮</button>
          <div v-if="isMenuOpen" class="board-card__dropdown" @click.stop role="menu">
            <button
              class="board-card__dropdown-item"
              type="button"
              role="menuitem"
              @click="isMenuOpen = false; startEditing()"
            >Edit</button>
            <button
              class="board-card__dropdown-item board-card__dropdown-item--danger"
              type="button"
              role="menuitem"
              @click="isMenuOpen = false; confirmDelete()"
            >Delete</button>
          </div>
        </div>
      </div>

      <div v-if="isConfirmingDelete" class="board-card__confirm-row" @click.stop>
        <span class="board-card__confirm-text">Delete board?</span>
        <button class="board-card__button board-card__button--danger" type="button" @click="deleteBoard">
          Confirm
        </button>
        <button class="board-card__button" type="button" @click="cancelDelete">Cancel</button>
      </div>

      <h3 class="board-card__title">{{ board.title }}</h3>
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
  padding: 0.75rem;
  background: var(--card-bg);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.board-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.board-card:hover {
  border-color: var(--accent);
}

.board-card__visibility {
  margin: 0;
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.board-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  min-width: 0;
}

.board-card__form {
  display: grid;
  gap: 0.5rem;
}

.board-card__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.board-card__field {
  min-height: 2.5rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.board-card__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.board-card__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.board-card__error {
  color: var(--danger);
  font-size: 0.8125rem;
  font-weight: 500;
}

.board-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.board-card__confirm-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
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
  font-size: 0.8125rem;
  font-weight: 600;
}

.board-card__button:hover {
  border-color: var(--accent);
}

.board-card__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.board-card__button--danger {
  color: var(--danger);
}

.board-card__button--danger:hover {
  border-color: var(--danger);
}

.board-card__title {
  margin: 0;
  color: var(--card-text);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: break-word;
}

.board-card__description {
  margin: 0.5rem 0 0;
  color: var(--card-muted);
  overflow-wrap: break-word;
}

.board-card__confirm-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--danger);
}

.board-card--selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.board-card__menu {
  position: relative;
  flex-shrink: 0;
}

.board-card__menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
}

.board-card__menu-trigger {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--card-muted);
  cursor: pointer;
  font: inherit;
  font-size: 1rem;
  line-height: 1;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.board-card__menu-trigger:hover {
  background: var(--card-border);
  color: var(--card-text);
}

.board-card__menu-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.board-card__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 50;
  min-width: 8rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.25rem;
  background: var(--card-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.board-card__dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--card-text);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: background-color 0.15s ease;
}

.board-card__dropdown-item:hover {
  background: var(--card-border);
}

.board-card__dropdown-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.board-card__dropdown-item--danger {
  color: var(--danger);
}

.board-card__dropdown-item--danger:hover {
  background: rgba(220, 53, 69, 0.08);
}
</style>
