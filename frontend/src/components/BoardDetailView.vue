<script setup lang="ts">
import { ref } from 'vue'
import ListColumn from './ListColumn.vue'
import ListCreateForm from './ListCreateForm.vue'
import type { Board } from '../models/board'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { CreateListInput, ProjectList, UpdateListInput } from '../models/list'

const props = defineProps<{
  board: Board | undefined
  lists: ProjectList[]
  cards: Card[]
  isFilteringCards?: boolean
}>()

const emit = defineEmits<{
  createCard: [card: CreateCardInput]
  updateCard: [card: Card, input: UpdateCardInput]
  deleteCard: [card: Card]
  updateList: [listId: string, input: UpdateListInput]
  deleteList: [listId: string]
  moveCard: [card: Card, targetListId: string]
  createList: [input: CreateListInput]
  moveList: [listId: string, targetListId: string]
}>()

const showListForm = ref(false)

function cardsForList(cards: Card[], listId: string) {
  return cards.filter((card) => card.listId === listId)
}

function createCard(card: CreateCardInput) {
  emit('createCard', card)
}

function updateCard(card: Card, input: UpdateCardInput) {
  emit('updateCard', card, input)
}

function deleteCard(card: Card) {
  emit('deleteCard', card)
}

function updateList(listId: string, input: UpdateListInput) {
  emit('updateList', listId, input)
}

function deleteList(listId: string) {
  emit('deleteList', listId)
}

function moveCard(cardId: string, targetListId: string) {
  const card = props.cards.find((card) => card.id === cardId)
  if (!card || card.listId === targetListId) return
  emit('moveCard', card, targetListId)
}

function moveList(listId: string, targetListId: string) {
  if (listId === targetListId) return
  emit('moveList', listId, targetListId)
}

function handleCreateList(input: CreateListInput) {
  emit('createList', input)
  showListForm.value = false
}
</script>

<template>
  <section class="board-detail-view">
    <div v-if="board" class="board-detail-view__content">
      <header class="board-detail-view__header">
        <h2>{{ board.title }}</h2>
        <p v-if="board.description">{{ board.description }}</p>
      </header>

      <div class="board-detail-view__columns">
        <ListColumn
          v-for="list in lists"
          :key="list.id"
          :list="list"
          :cards="cardsForList(cards, list.id)"
          :empty-message="
            isFilteringCards ? 'No matching cards in this list.' : 'No cards yet.'
          "
          @create-card="createCard"
          @update-card="updateCard"
          @delete-card="deleteCard"
          @update-list="updateList"
          @delete-list="deleteList"
          @move-card="moveCard"
          @move-list="moveList"
        />

        <ListCreateForm
          v-if="showListForm"
          :next-position="lists.length + 1"
          @create="handleCreateList"
          @cancel="showListForm = false"
        />

        <button
          v-else
          class="board-detail-view__add-list"
          type="button"
          @click="showListForm = true"
        >
          + Add list
        </button>
      </div>
    </div>

    <p v-else class="board-detail-view__empty">
      Select a board to see its lists and cards.
    </p>
  </section>
</template>

<style scoped>
.board-detail-view {
  margin-top: 0;
}

.board-detail-view__header {
  margin-bottom: 0.65rem;
}

h2 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: break-word;
}

.board-detail-view__header p {
  margin: 0.35rem 0 0;
  color: var(--card-muted);
}

.board-detail-view__columns {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
}

.board-detail-view__empty {
  margin: 0;
  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--card-muted);
  background: var(--card-bg);
}

.board-detail-view__add-list {
  align-self: flex-start;
  min-height: 2.75rem;
  min-width: 10rem;
  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 0 1rem;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
}

.board-detail-view__add-list:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.board-detail-view__add-list:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
