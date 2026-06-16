<script setup lang="ts">
import { ref } from 'vue'
import type { Card, UpdateCardInput } from '../models/card'

const props = defineProps<{
  card: Card
}>()

const emit = defineEmits<{
  update: [card: Card, input: UpdateCardInput]
  delete: [card: Card]
}>()

const isEditing = ref(false)
const isConfirmingDelete = ref(false)
const isMenuOpen = ref(false)
const title = ref(props.card.title)
const description = ref(props.card.description ?? '')
const titleError = ref('')

function startEditing() {
  title.value = props.card.title
  description.value = props.card.description ?? ''
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
    titleError.value = 'Card title is required.'
    return
  }

  emit('update', props.card, {
    title: trimmedTitle,
    description: trimmedDescription || undefined,
  })

  isEditing.value = false
}

function confirmDelete() {
  isConfirmingDelete.value = true
}

function cancelDelete() {
  isConfirmingDelete.value = false
}

function deleteCard() {
  emit('delete', props.card)
  isConfirmingDelete.value = false
}

function startDrag(event: DragEvent) {
  if (!event.dataTransfer) return
  event.stopPropagation()
  event.dataTransfer.setData('card', props.card.id)
  event.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <article
    class="card-item"
    draggable="true"
    @dragstart="startDrag"
  >
    <form v-if="isEditing" class="card-item__form" @submit.prevent="submitUpdate">
      <label class="card-item__group">
        <span>Card title</span>
        <input
          v-model="title"
          class="card-item__field"
          type="text"
          :aria-invalid="Boolean(titleError)"
          :aria-describedby="`edit-card-title-error-${card.id}`"
        />
        <span
          v-if="titleError"
          :id="`edit-card-title-error-${card.id}`"
          class="card-item__error"
        >
          {{ titleError }}
        </span>
      </label>

      <label class="card-item__group">
        <span>Description</span>
        <input v-model="description" class="card-item__field" type="text" />
      </label>

      <div class="card-item__actions">
        <button class="card-item__button" type="submit">Save</button>
        <button class="card-item__button" type="button" @click="cancelEditing">Cancel</button>
      </div>
    </form>

    <template v-else>
      <div class="card-item__header">
        <h4 class="card-item__title">{{ card.title }}</h4>
        <div class="card-item__menu">
          <div v-if="isMenuOpen" class="card-item__menu-backdrop" @click="isMenuOpen = false" />
          <button
            class="card-item__menu-trigger"
            type="button"
            :aria-label="`Options for ${card.title}`"
            @click="isMenuOpen = !isMenuOpen"
          >⋮</button>
          <div v-if="isMenuOpen" class="card-item__dropdown" role="menu">
            <button
              class="card-item__dropdown-item"
              type="button"
              role="menuitem"
              @click="isMenuOpen = false; startEditing()"
            >Edit</button>
            <button
              class="card-item__dropdown-item card-item__dropdown-item--danger"
              type="button"
              role="menuitem"
              @click="isMenuOpen = false; confirmDelete()"
            >Delete</button>
          </div>
        </div>
      </div>

      <div v-if="isConfirmingDelete" class="card-item__actions">
        <span class="card-item__confirm-text">Delete card?</span>
        <button class="card-item__button card-item__button--danger" type="button" @click="deleteCard">
          Confirm
        </button>
        <button class="card-item__button" type="button" @click="cancelDelete">Cancel</button>
      </div>

      <p v-if="card.description" class="card-item__description">
        {{ card.description }}
      </p>
    </template>
  </article>
</template>

<style scoped>
.card-item {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.6rem 0.7rem;
  background: var(--card-bg);
}

.card-item:hover {
  border-color: var(--accent);
}

.card-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-item__title {
  flex: 1;
  margin: 0;
  color: var(--card-text);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: break-word;
  min-width: 0;
}

.card-item__description {
  margin: 0.5rem 0 0;
  color: var(--card-muted);
  overflow-wrap: break-word;
}

.card-item__confirm-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--danger);
}

.card-item__form {
  display: grid;
  gap: 0.5rem;
}

.card-item__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.card-item__field {
  min-height: 2.5rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.card-item__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.card-item__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.card-item__error {
  color: var(--danger);
  font-size: 0.8125rem;
  font-weight: 500;
}

.card-item__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.card-item__button {
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

.card-item__button:hover {
  border-color: var(--accent);
}

.card-item__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.card-item__button--danger {
  color: var(--danger);
}

.card-item__button--danger:hover {
  border-color: var(--danger);
}

.card-item__menu {
  position: relative;
  flex-shrink: 0;
}

.card-item__menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
}

.card-item__menu-trigger {
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

.card-item__menu-trigger:hover {
  background: var(--card-border);
  color: var(--card-text);
}

.card-item__menu-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.card-item__dropdown {
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

.card-item__dropdown-item {
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

.card-item__dropdown-item:hover {
  background: var(--card-border);
}

.card-item__dropdown-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.card-item__dropdown-item--danger {
  color: var(--danger);
}

.card-item__dropdown-item--danger:hover {
  background: rgba(220, 53, 69, 0.08);
}
</style>
