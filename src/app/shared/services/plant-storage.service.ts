import { Plant } from '@/types/PlantType';
import { Injectable } from '@angular/core';
import { Dexie } from 'dexie';
import { db } from './app-database.service';

@Injectable({
  providedIn: 'root'
})
export class PlantStorageService {

  private table = db.plants;

  async addPlant(plant: Plant): Promise<number> {
    return await this.table.add(plant);
  }

  async updatePlant(id: number, plant: Partial<Plant>) {
    await this.table.update(id, plant);
  }

  async removePlant(id: number) {
    await this.table.delete(id);
  }

  async queryBy(query: string, value: any): Promise<Plant[]> {
    return await this.table.where(query).equals(value).toArray();
  }
}
