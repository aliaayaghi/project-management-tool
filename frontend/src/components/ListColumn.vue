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
}>()

const showCardForm = ref(false)
const isEditingList = ref(false)
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

function deleteList() {
  emit('deleteList', props.list.id)
}

function updateCard(card: Card, input: UpdateCardInput) {
  emit('updateCard', card, input)
}

function deleteCard(card: Card) {
  emit('deleteCard', card)
}

function dropCard(event: DragEvent) {
  const cardId = event.dataTransfer?.getData('text/plain')

  if (!cardId) {
    return
  }

  emit('moveCard', cardId, props.list.id)
}
</script>

<template>
  <section
  class="list-column"
  :class="`list-column--${list.status}`"
  @dragover.prevent
  @drop="dropCard"
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
        <div>
          <h3>{{ list.title }}</h3>
          <div class="list-column__actions">
            <button class="list-column__button" type="button" @click="startEditingList">Edit</button>
            <button class="list-column__button list-column__button--danger" type="button" @click="deleteList">
              Delete
            </button>
          </div>
        </div>
        <span class="list-column__count">{{ cards.length }}</span>
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
      {{ emptyMessage ?? 'No cards yet.' }}
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
  min-width: 17rem;
  border-radius: 8px;
  padding: 1rem;
  background: var(--column-bg);
}

.list-column__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.list-column__count {
  min-width: 2rem;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 800;
}

.list-column--todo h3 {
  color: #2e5070;
}

.list-column--todo .list-column__count {
  background: #daeaf5;
  color: #2e5070;
}

.list-column--in-progress h3 {
  color: #8a4030;
}

.list-column--in-progress .list-column__count {
  background: #f5e0d8;
  color: #8a4030;
}

.list-column--done h3 {
  color: #3d5c28;
}

.list-column--done .list-column__count {
  background: #dff0d4;
  color: #3d5c28;
}

.list-column__cards {
  display: grid;
  gap: 0.75rem;
}

.list-column__empty {
  margin: 0;
  color: #6d6258;
}

.list-column__add-card {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.75rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  background: var(--card-bg);
  color: #2e5070;
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
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
  font-size: 0.82rem;
  font-weight: 800;
}

.list-column__field {
  min-height: 2.25rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.list-column__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.list-column__error {
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 800;
}

.list-column__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.45rem;
}

.list-column__button {
  min-height: 1.9rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.55rem;
  background: var(--card-bg);
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
}

.list-column__button--danger {
  color: #a33434;
}

.list-column__empty {
  color: var(--empty-text);
}

:global(.app-shell--dark) .list-column__add-card {
  color: var(--card-text);
}
</style>
