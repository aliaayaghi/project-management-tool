export type BoardVisibility = 'private' | 'shared';

export interface Board {
  id: string;
  title: string;
  description?: string;
  visibility: BoardVisibility;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
