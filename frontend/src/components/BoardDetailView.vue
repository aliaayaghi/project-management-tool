<script setup lang="ts">
import ListColumn from './ListColumn.vue'
import type { Board } from '../models/board'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { ProjectList, UpdateListInput } from '../models/list'

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
}>()

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

  if (!card || card.listId === targetListId) {
    return
  }

  emit('moveCard', card, targetListId)
}
</script>

<template>
  <section class="board-detail-view">
    <div v-if="board" class="board-detail-view__content">
      <header class="board-detail-view__header">
        <p class="board-detail-view__eyebrow">Selected board</p>
        <h2>{{ board.title }}</h2>
        <p v-if="board.description">{{ board.description }}</p>
      </header>

      <div v-if="lists.length" class="board-detail-view__columns">
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
        />
      </div>

      <p v-else class="board-detail-view__empty">
        This board is missing its workflow columns.
      </p>
    </div>

    <p v-else class="board-detail-view__empty">
      Select a board to see its lists and cards.
    </p>
  </section>
</template>

<style scoped>
.board-detail-view {
  margin-top: 2rem;
}

.board-detail-view__header {
  margin-bottom: 1rem;
}

.board-detail-view__eyebrow {
  margin: 0 0 0.25rem;
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: var(--card-text);
  font-size: 1.6rem;
  font-weight: 800;
}

.board-detail-view__header p:not(.board-detail-view__eyebrow) {
  margin: 0.35rem 0 0;
  color: var(--card-muted);
}

.board-detail-view__columns {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.board-detail-view__empty {
  margin: 0;
  border: 1px dashed var(--card-border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--card-muted);
  background: var(--card-bg);
}
</style>
