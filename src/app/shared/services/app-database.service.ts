import Dexie, { Table } from 'dexie';
import { Plant } from '@/types/PlantType';
import { Collection } from '@/types/Collection';
import { ChoiceEntry } from '@/enums/ChoiceEntry';
import { ImageEntry } from '@/enums/ImageEntry';
import { BackupStateService } from './backup-state.service';

export class AppDatabase extends Dexie {
  plants!: Table<Plant, number>;
  collections!: Table<Collection, number>;
  choices!: Table<ChoiceEntry, number>;
  images!: Table<ImageEntry, number>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      plants: '++id, initialId, nameGerman, nameLatin, light, type',
      collections: '++id, initialId, name',
      choices: '++id, name',
      images: '++id, name',
    });

    this.plants = this.table('plants');
    this.collections = this.table('collections');
    this.choices = this.table('choices');

    for (const tableName of ['plants', 'collections', 'choices', 'images']) {
      const table = this.table(tableName);

      table.hook('creating', () => BackupStateService.markChanged());
      table.hook('updating', () => BackupStateService.markChanged());
      table.hook('deleting', () => BackupStateService.markChanged());
    }
  }
}

export const db = new AppDatabase();
