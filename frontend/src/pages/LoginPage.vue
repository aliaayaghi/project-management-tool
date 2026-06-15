<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

async function submitLogin() {
  const didLogin = await authStore.login(form)

  if (didLogin) {
    router.push('/')
  }
}
</script>

<template>
  <section class="auth-page">
    <form class="auth-form" @submit.prevent="submitLogin">
      <div>
        <p class="auth-form__eyebrow">Welcome back</p>
        <h2>Log in</h2>
      </div>

      <label>
        Email
        <input v-model="form.email" type="email" autocomplete="email" required />
      </label>

      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          minlength="8"
          required
        />
      </label>

      <p v-if="authStore.errorMessage" class="error-message">
        {{ authStore.errorMessage }}
      </p>

      <button class="auth-form__submit" type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Logging in...' : 'Log in' }}
      </button>

      <p class="auth-form__switch">
        Need an account?
        <RouterLink to="/register">Register</RouterLink>
      </p>
    </form>
  </section>
</template>

<style scoped>
.auth-page {
  display: grid;
  min-height: 60vh;
  place-items: center;
}

.auth-form {
  display: grid;
  width: min(100%, 28rem);
  gap: 1rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1.25rem;
  background: var(--card-bg);
  color: var(--card-text);
}

.auth-form__eyebrow {
  margin: 0 0 0.25rem;
  color: var(--accent);
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
}

label {
  display: grid;
  gap: 0.4rem;
  font-weight: 800;
}

input {
  min-height: 2.75rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0 0.85rem;
  background: var(--board-bg);
  color: var(--card-text);
  font: inherit;
}

.auth-form__submit {
  min-height: 2.75rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.auth-form__submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.auth-form__switch {
  margin: 0;
  color: var(--card-muted);
}

.auth-form__switch a {
  color: var(--accent);
  font-weight: 800;
}
</style>
