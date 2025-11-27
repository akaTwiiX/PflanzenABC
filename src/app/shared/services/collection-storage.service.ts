import { Collection } from '@/types/Collection';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { db } from './app-database.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionStorageService {
  private table = db.collections;

  async addCollection(collection: Collection): Promise<number> {
    return await this.table.add(collection);
  }

  async addChild(parentId: number, childId: number, type: 'collection' | 'plant') {
    const parent = await this.table.get(parentId);
    if (!parent) return;

    if (type === 'collection') {
      const updatedIds = [...(parent.collectionIds ?? []), childId];
      await this.updateCollection(parentId, { collectionIds: updatedIds });
    } else {
      const updatedIds = [...(parent.plantIds ?? []), childId];
      await this.updateCollection(parentId, { plantIds: updatedIds });
    }
  }

  async removeCollection(id: number) {
    await this.table.delete(id);
  }

  async updateCollection(id: number, collection: Partial<Collection>) {
    await this.table.update(id, collection);
  }

  async queryBy(query: string, value: any): Promise<Collection[]> {
    return await this.table.where(query).equals(value).toArray();
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return await this.table.get(id);
  }

  async bulkGet(ids: number[]): Promise<Collection[]> {
    const results = await this.table.bulkGet(ids);
    return results.filter((c): c is Collection => !!c);
  }
}
