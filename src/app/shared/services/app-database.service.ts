import Dexie, { Table } from 'dexie';
import { Plant } from '@/types/PlantType';
import { Collection } from '@/types/Collection';

export class AppDatabase extends Dexie {
  plants!: Table<Plant, number>;
  collections!: Table<Collection, number>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      plants: '++id, initialId, nameGerman, nameLatin, light, type',
      collections: '++id, initialId, name',
    });

    this.plants = this.table('plants');
    this.collections = this.table('collections');
  }
}

export const db = new AppDatabase();
