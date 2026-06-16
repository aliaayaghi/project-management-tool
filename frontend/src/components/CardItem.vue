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

function deleteCard() {
  emit('delete', props.card)
}

function startDrag(event: DragEvent) {
  if (!event.dataTransfer) {
    return
  }

  event.dataTransfer.setData('text/plain', props.card.id)
  event.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <article 
  class="card-item" 
  draggable="true"
  @dragstart="startDrag">
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
        <div class="card-item__actions">
          <button class="card-item__button" type="button" @click="startEditing">Edit</button>
          <button class="card-item__button card-item__button--danger" type="button" @click="deleteCard">
            Delete
          </button>
        </div>
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
  padding: 0.85rem;
  background: var(--card-bg);
}

.card-item:hover {
  border-color: var(--accent);
}

.card-item__header {
  display: grid;
  gap: 0.5rem;
}

.card-item__title {
  margin: 0;
  color: var(--card-text);
  font-size: 0.98rem;
  font-weight: 700;
}

.card-item__description {
  margin: 0.5rem 0 0;
  color: var(--card-muted);
}

.card-item__form {
  display: grid;
  gap: 0.5rem;
}

.card-item__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.82rem;
  font-weight: 800;
}

.card-item__field {
  min-height: 2.25rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.card-item__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.card-item__error {
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 800;
}

.card-item__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.card-item__button {
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

.card-item__button--danger {
  color: #a33434;
}
</style>
