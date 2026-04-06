import type { LightRequirement } from '../enums/LightRequirements';
import type { WaterRequirement } from '../enums/WaterRequirements';
import type { AutumnColors } from './AutumnColors';
import type { Fruit } from './Fruit';
import type { RangeSliderType } from './RangeSliderType';

export interface ActionWithDetails {
  enabled: boolean;
  time: string;
  amount?: string;
  type?: string | string[];
}

export interface ActionWithSlider {
  enabled: boolean;
  value: RangeSliderType;
}

interface ActionWithRangeTime extends Omit<ActionWithDetails, 'time'> {
  time: RangeSliderType;
}

export interface Plant {
  id?: number;
  initialId?: string;
  nameGerman: string;
  nameLatin: string;
  pruning: ActionWithRangeTime;
  fertilization: ActionWithRangeTime;
  soil: string;
  distance: ActionWithSlider;
  height: RangeSliderType;
  width: RangeSliderType;
  growth: RangeSliderType;
  growthForm: string[];
  leafShape: string[];
  bloomTime: RangeSliderType;
  harvestTime: RangeSliderType;
  type: string[];
  light: LightRequirement[];
  watering: WaterRequirement;
  frostResistant: boolean;
  fruit: Fruit;
  bloomColor: string[];
  leafColor: string[];
  autumnColors: AutumnColors;
  requiredArea: ActionWithSlider;
  rootSystem: string;
  evergreen: boolean;
  bugsFriendly: boolean;
  birdFriendly: boolean;
  regional: boolean;
  dryTolerance: boolean;
  edible: boolean;
  toxic: boolean;
  fragrant: boolean;
  buckets: boolean;
  notice?: string;
  imageUrl?: string;
  collectionId?: number;
  updatedAt: string;
  createdAt?: string;
}
