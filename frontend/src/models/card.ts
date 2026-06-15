export type Card = {
  id: string
  boardId: string
  listId: string
  title: string
  description?: string
  position: number
  createdAt: string
  updatedAt: string
}

export type CreateCardInput = {
  listId: string
  title: string
  description?: string
}

export type UpdateCardInput = {
  title?: string
  description?: string
  position?: number
  listId?: string
}
