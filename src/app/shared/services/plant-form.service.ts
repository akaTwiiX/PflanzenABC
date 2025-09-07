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
    distance: { start: null, end: null },
    height: { start: null, end: null },
    bloomTime: { start: null, end: null },
    type: PlantTypes.HERB,
    light: LightRequirement.FULL_SUN,
    watering: WaterRequirement.MEDIUM,
    frostResistant: false,
    fruit: { enabled: false, time: { start: null, end: null } },
    leaf: false,
    dryTolerance: false,
    edible: false,
    toxic: false,
    fragrant: false,
    buckets: false,
    notice: '',
    imageUrl: '',
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

  getPlant() {
    return structuredClone(this.state$.value);
  }

  reset() {
    this.state$.next(structuredClone(this.initialState));
  }
}
