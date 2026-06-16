<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BoardDetailView from '../components/BoardDetailView.vue'
import { useProjectStore } from '../stores/projectStore'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { UpdateListInput } from '../models/list'

const route = useRoute()
const projectStore = useProjectStore()
const cardSearchQuery = ref('')

const boardId = computed(() => route.params.boardId as string)
const board = computed(() => projectStore.getBoard(boardId.value))
const lists = computed(() => projectStore.getBoardLists(boardId.value))
const cards = computed(() => projectStore.getBoardCards(boardId.value))
const filteredCards = computed(() => {
  const query = cardSearchQuery.value.trim().toLowerCase()

  if (!query) {
    return cards.value
  }

  return cards.value.filter((card) =>
    [card.title, card.description ?? '']
      .join(' ')
      .toLowerCase()
      .includes(query),
  )
})

onMounted(async () => {
  await ensureBoardPageData()
})

watch(boardId, () => {
  ensureBoardPageData()
})

async function ensureBoardPageData() {
  if (!projectStore.boards.length) {
    await projectStore.loadBoards()
  }

  await projectStore.loadBoardDetails(boardId.value)
}

function createCard(input: CreateCardInput) {
  projectStore.createCard(boardId.value, input)
}

function updateList(listId: string, input: UpdateListInput) {
  projectStore.updateList(boardId.value, listId, input)
}

function deleteList(listId: string) {
  projectStore.deleteList(boardId.value, listId)
}

function updateCard(card: Card, input: UpdateCardInput) {
  projectStore.updateCard(card, input)
}

function deleteCard(card: Card) {
  projectStore.deleteCard(card)
}

function moveCard(card: Card, targetListId: string) {
  projectStore.updateCard(card, {
    listId: targetListId,
  })
}
</script>

<template>
  <section class="board-page">
    <nav class="board-page__nav" aria-label="Board navigation">
      <RouterLink to="/">All boards</RouterLink>
      <RouterLink :to="`/boards/${boardId}/settings`">Settings</RouterLink>
    </nav>

    <p v-if="projectStore.isLoading" class="status-message">
      Loading board details...
    </p>

    <p v-if="projectStore.errorMessage" class="error-message">
      {{ projectStore.errorMessage }}
    </p>

    <label class="board-page__search">
      <span>Search cards</span>
      <input
        v-model="cardSearchQuery"
        type="search"
        placeholder="Filter by card title or description"
      />
    </label>

    <p class="board-page__summary">
      {{ filteredCards.length }} of {{ cards.length }} cards
    </p>

    <BoardDetailView
      :board="board"
      :lists="lists"
      :cards="filteredCards"
      :is-filtering-cards="Boolean(cardSearchQuery.trim())"
      @create-card="createCard"
      @update-card="updateCard"
      @delete-card="deleteCard"
      @update-list="updateList"
      @delete-list="deleteList"
      @move-card="moveCard"
    />
  </section>
</template>

<style scoped>
.board-page {
  display: grid;
  gap: 1rem;
}

.board-page__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.board-page__nav a {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  background: var(--card-bg);
  color: var(--accent);
  font-weight: 800;
  text-decoration: none;
}

.board-page__nav a.router-link-active {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.board-page__search {
  display: grid;
  gap: 0.35rem;
  color: var(--card-text);
  font-size: 0.9rem;
  font-weight: 800;
}

.board-page__search input {
  min-height: 2.75rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.85rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.board-page__search input:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.board-page__summary {
  margin: 0;
  color: var(--accent);
  font-weight: 800;
}
</style>
