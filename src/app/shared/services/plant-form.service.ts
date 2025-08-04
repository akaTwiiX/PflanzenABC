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
    pruning: '',
    fertilization: '',
    soil: '',
    distance: { start: null, end: null },
    height: { start: null, end: null },
    bloomTime: { start: null, end: null },
    type: PlantTypes.HERB,
    light: LightRequirement.FULL_SUN,
    watering: WaterRequirement.MEDIUM,
    frostResistant: false,
    fruit: false,
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

  setValue<K extends keyof Plant>(key: K, value: Plant[K]) {
    const current = this.state$.value;
    this.state$.next({ ...current, [key]: value });
  }

  reset() {
    this.state$.next({ ...this.initialState });
  }
}
