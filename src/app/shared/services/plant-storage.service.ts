import { Plant } from '@/types/PlantType';
import { Injectable } from '@angular/core';
import { db } from './app-database.service';

@Injectable({
  providedIn: 'root',
})
export class PlantStorageService {
  private table = db.plants;

  async addPlant(plant: Plant): Promise<number> {
    plant.updatedAt = new Date().toISOString();
    plant.createdAt = new Date().toISOString();
    return await this.table.add(plant);
  }

  async updatePlant(id: number, plant: Partial<Plant>) {
    plant.updatedAt = new Date().toISOString();
    await this.table.update(id, plant);
  }

  async removePlant(id: number) {
    await this.table.delete(id);
  }

  async queryBy(query: string, value: any): Promise<Plant[]> {
    return await this.table.where(query).equals(value).toArray();
  }

  async searchPlants(query: string): Promise<Plant[]> {
    return await this.table
      .where('nameGerman')
      .startsWithIgnoreCase(query)
      .or('nameLatin')
      .startsWithIgnoreCase(query)
      .toArray();
  }

  getPlant(id: number): Promise<Plant | undefined> {
    return this.table.get(id);
  }

  async bulkGet(ids: number[]): Promise<Plant[]> {
    const results = await this.table.bulkGet(ids);
    return results.filter((c): c is Plant => !!c);
  }

  async bulkDelete(ids: number[]) {
    await this.table.bulkDelete(ids);
  }
}
