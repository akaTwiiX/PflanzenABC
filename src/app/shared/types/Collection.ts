export interface Collection {
  id?: number;
  initialId?: string;
  name: string;
  description?: string;
  plantIds: number[];
  collectionIds: number[];
  updatedAt: string;
}
