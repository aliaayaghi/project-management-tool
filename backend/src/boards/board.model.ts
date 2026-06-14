export type BoardVisibility = 'private' | 'shared';

export interface Board {
  id: string;
  title: string;
  description?: string;
  visibility: BoardVisibility;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
