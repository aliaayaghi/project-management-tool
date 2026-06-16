<script setup lang="ts">
import { ref } from 'vue'
import type { CreateListInput } from '../models/list'

const props = defineProps<{
  nextPosition: number
}>()

const emit = defineEmits<{
  create: [input: CreateListInput]
  cancel: []
}>()

const title = ref('')
const titleError = ref('')

function submitForm() {
  const trimmedTitle = title.value.trim()

  titleError.value = ''

  if (!trimmedTitle) {
    titleError.value = 'List title is required.'
    return
  }

  emit('create', {
    title: trimmedTitle,
    status: 'todo',
    position: props.nextPosition,
  })

  title.value = ''
}

function cancel() {
  title.value = ''
  titleError.value = ''
  emit('cancel')
}
</script>

<template>
  <form class="list-create-form" @submit.prevent="submitForm">
    <label class="list-create-form__group">
      <span>List title</span>
      <input
        v-model="title"
        class="list-create-form__field"
        type="text"
        placeholder="e.g. Review"
        maxlength="100"
        :aria-invalid="Boolean(titleError)"
        aria-describedby="list-title-error"
        autofocus
      />
      <span v-if="titleError" id="list-title-error" class="list-create-form__error">
        {{ titleError }}
      </span>
    </label>

    <div class="list-create-form__actions">
      <button class="list-create-form__button list-create-form__button--primary" type="submit">
        Add list
      </button>
      <button class="list-create-form__button" type="button" @click="cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped>
.list-create-form {
  display: grid;
  gap: 0.5rem;
  min-width: 14rem;
  max-width: 17rem;
  border-radius: 8px;
  padding: 1rem;
  background: var(--column-bg);
  flex-shrink: 0;
}

.list-create-form__group {
  display: grid;
  gap: 0.3rem;
  color: var(--card-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.list-create-form__field {
  min-height: 2.35rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.65rem;
  background: var(--card-bg);
  color: var(--card-text);
  font: inherit;
}

.list-create-form__field:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent-soft);
  outline-offset: 1px;
}

.list-create-form__field[aria-invalid='true'] {
  border-color: var(--danger);
}

.list-create-form__error {
  color: var(--danger);
  font-size: 0.8125rem;
  font-weight: 500;
}

.list-create-form__actions {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.list-create-form__button {
  min-height: 2.35rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.75rem;
  background: var(--card-bg);
  color: var(--accent);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
}

.list-create-form__button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.list-create-form__button--primary {
  background: var(--clay);
  border-color: var(--clay);
  color: #ffffff;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.list-create-form__button--primary:hover {
  background: var(--clay-hover);
  border-color: var(--clay-hover);
}

.list-create-form__button--primary:focus-visible {
  outline: 2px solid var(--clay);
  outline-offset: 2px;
}
</style>
