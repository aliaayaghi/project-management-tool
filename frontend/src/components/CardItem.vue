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

function startEditing() {
  title.value = props.card.title
  description.value = props.card.description ?? ''
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

function submitUpdate() {
  const trimmedTitle = title.value.trim()
  const trimmedDescription = description.value.trim()

  if (!trimmedTitle) {
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
</script>

<template>
  <article class="card-item">
    <form v-if="isEditing" class="card-item__form" @submit.prevent="submitUpdate">
      <input v-model="title" class="card-item__field" type="text" />
      <input v-model="description" class="card-item__field" type="text" />

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

.card-item__field {
  min-height: 2.25rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
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
