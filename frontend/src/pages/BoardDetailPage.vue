<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BoardDetailView from '../components/BoardDetailView.vue'
import { useProjectStore } from '../stores/projectStore'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { UpdateListInput } from '../models/list'

const route = useRoute()
const projectStore = useProjectStore()

const boardId = computed(() => route.params.boardId as string)
const board = computed(() => projectStore.getBoard(boardId.value))
const lists = computed(() => projectStore.getBoardLists(boardId.value))
const cards = computed(() => projectStore.getBoardCards(boardId.value))

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

    <BoardDetailView
      :board="board"
      :lists="lists"
      :cards="cards"
      @create-card="createCard"
      @update-card="updateCard"
      @delete-card="deleteCard"
      @update-list="updateList"
      @delete-list="deleteList"
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
</style>
