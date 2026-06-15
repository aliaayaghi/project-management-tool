import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, LoginInput, RegisterInput } from '../models/auth'
import {
  login as loginRequest,
  register as registerRequest,
} from '../api/projectApi'

const AUTH_TOKEN_STORAGE_KEY = 'project-management-auth-token'
const AUTH_USER_STORAGE_KEY = 'project-management-auth-user'

function getStoredUser() {
  const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(getStoredUser())
  const accessToken = ref(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
  const isLoading = ref(false)
  const errorMessage = ref('')

  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  async function register(input: RegisterInput) {
    return authenticate(() => registerRequest(input))
  }

  async function login(input: LoginInput) {
    return authenticate(() => loginRequest(input))
  }

  function logout() {
    user.value = null
    accessToken.value = null
    errorMessage.value = ''
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  async function authenticate(
    request: () => ReturnType<typeof loginRequest | typeof registerRequest>,
  ) {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const authResponse = await request()

      user.value = authResponse.user
      accessToken.value = authResponse.accessToken
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authResponse.accessToken)
      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify(authResponse.user),
      )

      return true
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message
    }

    return 'Something went wrong while signing in.'
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    errorMessage,
    register,
    login,
    logout,
  }
})
