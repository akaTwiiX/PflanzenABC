import type { RangeSliderType } from './RangeSliderType';

export interface Fruit {
  enabled: boolean;
  time: RangeSliderType;
  selfFertilizing: boolean;
  fertilizationType: string[];
  color: string[];
}
