<script setup lang="ts">
import { ref } from 'vue'
import type { CreateCardInput } from '../models/card'

const props = defineProps<{
  listId: string
}>()

const title = ref('')
const description = ref('')
const titleError = ref('')

const emit = defineEmits<{
  create: [card: CreateCardInput]
}>()

function submitForm() {
  const trimmedTitle = title.value.trim()
  const trimmedDescription = description.value.trim()

  titleError.value = ''

  if (!trimmedTitle) {
    titleError.value = 'Card title is required.'
    return
  }

  emit('create', {
    listId: props.listId,
    title: trimmedTitle,
    description: trimmedDescription || undefined,
  })

  title.value = ''
  description.value = ''
}
</script>

<template>
  <form class="card-create-form" @submit.prevent="submitForm">
    <label class="card-create-form__group">
      <span>Card title</span>
      <input
        v-model="title"
        class="card-create-form__field"
        type="text"
        placeholder="Card title"
        :aria-invalid="Boolean(titleError)"
        :aria-describedby="`card-title-error-${listId}`"
      />
      <span
        v-if="titleError"
        :id="`card-title-error-${listId}`"
        class="card-create-form__error"
      >
        {{ titleError }}
      </span>
    </label>

    <label class="card-create-form__group">
      <span>Description</span>
      <input
        v-model="description"
        class="card-create-form__field"
        type="text"
        placeholder="Description"
      />
    </label>

    <button class="card-create-form__button" type="submit">
      Add card
    </button>
  </form>
</template>

<style scoped>
.card-create-form {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.card-create-form__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.82rem;
  font-weight: 800;
}

.card-create-form__field {
  min-height: 2.35rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.75rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.card-create-form__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.card-create-form__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.card-create-form__error {
  color: var(--danger);
  font-size: 0.8rem;
  font-weight: 800;
}

.card-create-form__button {
  min-height: 2.35rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.card-create-form__button:hover {
  border-color: var(--accent);
}
</style>
