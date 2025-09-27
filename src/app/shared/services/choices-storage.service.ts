import { Injectable } from '@angular/core';
import { db } from './app-database.service';
import { ChoiceName } from '@/enums/ChoiceEntry';

@Injectable({
  providedIn: 'root'
})
export class ChoicesStorageService {
  private table = db.choices;

  async addChoices(value: { name: ChoiceName, value: string[] }): Promise<number> {
    return await this.table.add(value);
  }

  async getChoicesByName(name: ChoiceName): Promise<string[]> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      return entry.value;
    }

    await this.table.add({ name, value: [] });
    return [];
  }

  async addValue(name: ChoiceName, newValue: string): Promise<void> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      if (!entry.value.includes(newValue)) {
        entry.value.push(newValue);
        await this.table.update(entry.id!, { value: entry.value });
      }
    } else {
      await this.table.add({ name, value: [newValue] });
    }
  }

  async removeValue(name: ChoiceName, valueToRemove: string): Promise<void> {
    const entry = await this.table.where('name').equals(name).first();
    if (entry) {
      const filtered = entry.value.filter(v => v !== valueToRemove);
      await this.table.update(entry.id!, { value: filtered });
    }
  }
}
