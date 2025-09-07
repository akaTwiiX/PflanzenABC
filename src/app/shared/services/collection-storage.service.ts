import { Collection } from '@/types/Collection';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { db } from './app-database.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionStorageService {
  private table = db.collections;

  async addCollection(collection: Collection): Promise<number> {
    return await this.table.add(collection);
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
}
