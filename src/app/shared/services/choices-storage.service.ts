import { Injectable } from '@angular/core';
import { db } from './app-database.service';
import { ChoiceEntry, ChoiceName } from '@/enums/ChoiceEntry';

@Injectable({
  providedIn: 'root',
})
export class ChoicesStorageService {
  private table = db.choices;

  async addChoices(value: ChoiceEntry): Promise<number> {
    return await this.table.add(value);
  }

  async getChoicesByName(name: ChoiceName): Promise<string[]> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      return entry.value;
    }

    await this.table.add({ name, value: [], updatedAt: new Date().toISOString() });
    return [];
  }

  async addValue(name: ChoiceName, newValue: string): Promise<void> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      if (!entry.value.includes(newValue)) {
        entry.value.push(newValue);
        await this.table.update(entry.id!, {
          value: entry.value,
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      await this.table.add({ name, value: [newValue], updatedAt: new Date().toISOString() });
    }
  }

  async removeValue(name: ChoiceName, valueToRemove: string): Promise<void> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      const filtered = entry.value.filter((v) => v !== valueToRemove);
      await this.table.update(entry.id!, { value: filtered });
    }
  }
}
