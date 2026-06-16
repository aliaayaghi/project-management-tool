<script setup lang="ts">
import { ref } from 'vue'
import CardCreateForm from './CardCreateForm.vue'
import CardItem from './CardItem.vue'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { ListStatus, ProjectList, UpdateListInput } from '../models/list'

const props = defineProps<{
  list: ProjectList
  cards: Card[]
  emptyMessage?: string
}>()

const emit = defineEmits<{
  createCard: [card: CreateCardInput]
  updateCard: [card: Card, input: UpdateCardInput]
  deleteCard: [card: Card]
  updateList: [listId: string, input: UpdateListInput]
  deleteList: [listId: string]
  moveCard: [cardId: string, targetListId: string]
  moveList: [listId: string, targetListId: string]
}>()

const showCardForm = ref(false)
const isEditingList = ref(false)
const isConfirmingDelete = ref(false)
const isMenuOpen = ref(false)
const listTitle = ref(props.list.title)
const listStatus = ref<ListStatus>(props.list.status)
const listTitleError = ref('')

function createCard(card: CreateCardInput) {
  emit('createCard', card)
  showCardForm.value = false
}

function toggleCardForm() {
  showCardForm.value = !showCardForm.value
}

function startEditingList() {
  listTitle.value = props.list.title
  listStatus.value = props.list.status
  listTitleError.value = ''
  isEditingList.value = true
}

function cancelEditingList() {
  listTitleError.value = ''
  isEditingList.value = false
}

function submitListUpdate() {
  const trimmedTitle = listTitle.value.trim()

  listTitleError.value = ''

  if (!trimmedTitle) {
    listTitleError.value = 'List title is required.'
    return
  }

  emit('updateList', props.list.id, {
    title: trimmedTitle,
    status: listStatus.value,
  })

  isEditingList.value = false
}

function confirmDelete() {
  isConfirmingDelete.value = true
}

function cancelDelete() {
  isConfirmingDelete.value = false
}

function deleteList() {
  emit('deleteList', props.list.id)
  isConfirmingDelete.value = false
}

function updateCard(card: Card, input: UpdateCardInput) {
  emit('updateCard', card, input)
}

function deleteCard(card: Card) {
  emit('deleteCard', card)
}

function startDrag(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.setData('list', props.list.id)
  event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event: DragEvent) {
  const cardId = event.dataTransfer?.getData('card')
  if (cardId) {
    emit('moveCard', cardId, props.list.id)
    return
  }
  const listId = event.dataTransfer?.getData('list')
  if (listId) {
    emit('moveList', listId, props.list.id)
  }
}
</script>

<template>
  <section
    class="list-column"
    :class="`list-column--${list.status}`"
    draggable="true"
    @dragstart="startDrag"
    @dragover.prevent
    @drop="onDrop"
  >
    <header class="list-column__header">
      <form v-if="isEditingList" class="list-column__form" @submit.prevent="submitListUpdate">
        <label class="list-column__group">
          <span>List title</span>
          <input
            v-model="listTitle"
            class="list-column__field"
            type="text"
            :aria-invalid="Boolean(listTitleError)"
            :aria-describedby="`list-title-error-${list.id}`"
          />
          <span
            v-if="listTitleError"
            :id="`list-title-error-${list.id}`"
            class="list-column__error"
          >
            {{ listTitleError }}
          </span>
        </label>

        <label class="list-column__group">
          <span>Status</span>
          <select v-model="listStatus" class="list-column__field">
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <div class="list-column__actions">
          <button class="list-column__button" type="submit">Save</button>
          <button class="list-column__button" type="button" @click="cancelEditingList">Cancel</button>
        </div>
      </form>

      <template v-else>
        <div class="list-column__title-area">
          <h3>{{ list.title }}</h3>
          <div v-if="isConfirmingDelete" class="list-column__actions">
            <span class="list-column__confirm-text">Delete list?</span>
            <button class="list-column__button list-column__button--danger" type="button" @click="deleteList">
              Confirm
            </button>
            <button class="list-column__button" type="button" @click="cancelDelete">Cancel</button>
          </div>
        </div>
        <div class="list-column__header-right">
          <span class="list-column__count">{{ cards.length }}</span>
          <div class="list-column__menu">
            <div v-if="isMenuOpen" class="list-column__menu-backdrop" @click="isMenuOpen = false" />
            <button
              class="list-column__menu-trigger"
              type="button"
              :aria-label="`Options for ${list.title}`"
              @click="isMenuOpen = !isMenuOpen"
            >⋮</button>
            <div v-if="isMenuOpen" class="list-column__dropdown" role="menu">
              <button
                class="list-column__dropdown-item"
                type="button"
                role="menuitem"
                @click="isMenuOpen = false; startEditingList()"
              >Edit</button>
              <button
                class="list-column__dropdown-item list-column__dropdown-item--danger"
                type="button"
                role="menuitem"
                @click="isMenuOpen = false; confirmDelete()"
              >Delete</button>
            </div>
          </div>
        </div>
      </template>
    </header>

    <div v-if="cards.length" class="list-column__cards">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
        @update="updateCard"
        @delete="deleteCard"
      />
    </div>

    <p v-else class="list-column__empty">
      {{ emptyMessage ?? 'No cards yet. Hit + to add one.' }}
    </p>

    <button
      class="list-column__add-card"
      type="button"
      :aria-label="showCardForm ? 'Close card form' : `Add card to ${list.title}`"
      @click="toggleCardForm"
    >
      {{ showCardForm ? 'x' : '+' }}
    </button>

    <CardCreateForm
      v-if="showCardForm"
      :list-id="list.id"
      @create="createCard"
    />
  </section>
</template>

<style scoped>
.list-column {
  min-width: 14rem;
  border-radius: 8px;
  padding: 0.75rem;
  background: var(--column-bg);
}

.list-column__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.list-column__title-area {
  flex: 1;
  min-width: 0;
}

.list-column__header-right {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: break-word;
}

.list-column__confirm-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--danger);
}

.list-column__count {
  min-width: 2rem;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
}

.list-column--todo h3 {
  color: var(--status-todo-text);
}

.list-column--todo .list-column__count {
  background: var(--status-todo-fill);
  color: var(--status-todo-text);
}

.list-column--in-progress h3 {
  color: var(--status-progress-text);
}

.list-column--in-progress .list-column__count {
  background: var(--status-progress-fill);
  color: var(--status-progress-text);
}

.list-column--done h3 {
  color: var(--status-done-text);
}

.list-column--done .list-column__count {
  background: var(--status-done-fill);
  color: var(--status-done-text);
}

.list-column__cards {
  display: grid;
  gap: 0.5rem;
}

.list-column__empty {
  margin: 0;
  color: var(--empty-text);
}

.list-column__add-card {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.5rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
}

.list-column__add-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.list-column__form {
  display: grid;
  gap: 0.5rem;
  width: 100%;
}

.list-column__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.list-column__field {
  min-height: 2.5rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.list-column__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.list-column__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.list-column__error {
  color: var(--danger);
  font-size: 0.8125rem;
  font-weight: 500;
}

.list-column__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.45rem;
}

.list-column__button {
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

.list-column__button:hover {
  border-color: var(--accent);
}

.list-column__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.list-column__button--danger {
  color: var(--danger);
}

.list-column__button--danger:hover {
  border-color: var(--danger);
}

.list-column__menu {
  position: relative;
}

.list-column__menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
}

.list-column__menu-trigger {
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

.list-column__menu-trigger:hover {
  background: var(--card-border);
  color: var(--card-text);
}

.list-column__menu-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.list-column__dropdown {
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

.list-column__dropdown-item {
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

.list-column__dropdown-item:hover {
  background: var(--card-border);
}

.list-column__dropdown-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.list-column__dropdown-item--danger {
  color: var(--danger);
}

.list-column__dropdown-item--danger:hover {
  background: rgba(220, 53, 69, 0.08);
}

:global(.app-shell--dark) .list-column__add-card {
  color: var(--card-text);
}
</style>
