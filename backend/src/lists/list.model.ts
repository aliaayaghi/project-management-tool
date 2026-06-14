export type ListStatus = 'todo' | 'in-progress' | 'done';

export interface ProjectList {
  id: string;
  boardId: string;
  title: string;
  status: ListStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
