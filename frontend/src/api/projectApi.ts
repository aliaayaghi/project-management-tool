import type { Board, CreateBoardInput, UpdateBoardInput } from '../models/board'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { ListStatus, ProjectList, UpdateListInput } from '../models/list'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
const DEMO_OWNER_ID = 'user-1'

type CreateListInput = {
  title: string
  status: ListStatus
  position: number
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getBoards() {
  return request<Board[]>('/boards')
}

export function createBoard(input: CreateBoardInput) {
  return request<Board>('/boards', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      ownerId: DEMO_OWNER_ID,
    }),
  })
}

export function updateBoard(boardId: string, input: UpdateBoardInput) {
  return request<Board>(`/boards/${boardId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteBoard(boardId: string) {
  return request<Board>(`/boards/${boardId}`, {
    method: 'DELETE',
  })
}

export function getLists(boardId: string) {
  return request<ProjectList[]>(`/boards/${boardId}/lists`)
}

export function createList(boardId: string, input: CreateListInput) {
  return request<ProjectList>(`/boards/${boardId}/lists`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateList(
  boardId: string,
  listId: string,
  input: UpdateListInput,
) {
  return request<ProjectList>(`/boards/${boardId}/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteList(boardId: string, listId: string) {
  return request<ProjectList>(`/boards/${boardId}/lists/${listId}`, {
    method: 'DELETE',
  })
}

export function getCards(boardId: string, listId: string) {
  return request<Card[]>(`/boards/${boardId}/lists/${listId}/cards`)
}

export function createCard(boardId: string, input: CreateCardInput) {
  return request<Card>(`/boards/${boardId}/lists/${input.listId}/cards`, {
    method: 'POST',
    body: JSON.stringify({
      title: input.title,
      description: input.description,
    }),
  })
}

export function updateCard(
  boardId: string,
  listId: string,
  cardId: string,
  input: UpdateCardInput,
) {
  return request<Card>(`/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteCard(boardId: string, listId: string, cardId: string) {
  return request<Card>(`/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
    method: 'DELETE',
  })
}
