import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlantTypes } from '../enums/PlantTypes';
import { LightRequirement } from '../enums/LightRequirements';
import { WaterRequirement } from '../enums/WaterRequirements';
import { Plant } from '../types/PlantType';

@Injectable({
  providedIn: 'root',
})
export class PlantFormService {
  private initialState: Plant = {
    nameGerman: '',
    nameLatin: '',
    pruning: { enabled: false, time: '', amount: '' },
    fertilization: { enabled: false, type: '', time: '' },
    soil: '',
    distance: { start: 0.5, end: 10 },
    height: { start: 0.5, end: 10 },
    bloomTime: { start: 'Januar', end: 'Dezember' },
    type: '',
    light: LightRequirement.FULL_SUN,
    watering: WaterRequirement.MEDIUM,
    frostResistant: false,
    fruit: { enabled: false, time: { start: 'Januar', end: 'Dezember' } },
    leaf: false,
    dryTolerance: false,
    edible: false,
    toxic: false,
    fragrant: false,
    buckets: false,
    notice: '',
    imageUrl: '',
    updatedAt: '',
  };

  private state$ = new BehaviorSubject<Plant>(this.initialState);
  readonly plantForm$ = this.state$.asObservable();

  update(path: string, value: any) {
    const keys = path.split('.');
    const current = structuredClone(this.state$.value);

    let target: any = current;
    while (keys.length > 1) {
      const key = keys.shift()!;
      target = target[key];
    }
    target[keys[0]] = value;

    this.state$.next(current);
  }

  setPlant(plant: Plant) {
    this.state$.next(structuredClone(plant));
  }

  getPlant() {
    return structuredClone(this.state$.value);
  }

  reset() {
    this.state$.next(structuredClone(this.initialState));
  }
}
