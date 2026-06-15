export type BoardVisibility = 'private' | 'shared'

export type Board = {
  id: string
  title: string
  description?: string
  visibility: BoardVisibility
  ownerId: string
  memberIds: string[]
  createdAt: string
  updatedAt: string
}

export type CreateBoardInput = {
  title: string
  description?: string
  visibility: BoardVisibility
}

export type UpdateBoardInput = Partial<CreateBoardInput>
