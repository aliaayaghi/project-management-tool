export interface Card {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  description?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
