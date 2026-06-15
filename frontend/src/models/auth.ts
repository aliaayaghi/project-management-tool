export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type AuthResponse = {
  user: AuthUser
  accessToken: string
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}
