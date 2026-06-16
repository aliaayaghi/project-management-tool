export type ListStatus = 'todo' | 'in-progress' | 'done'

export type ProjectList = {
  id: string
  boardId: string
  title: string
  status: ListStatus
  position: number
  createdAt: string
  updatedAt: string
}

export type CreateListInput = {
  title: string
  status: ListStatus
  position: number
}

export type UpdateListInput = {
  title?: string
  status?: ListStatus
  position?: number
}
