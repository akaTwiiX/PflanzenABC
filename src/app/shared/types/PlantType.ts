import { LightRequirement } from '../enums/LightRequirements';
import { WaterRequirement } from '../enums/WaterRequirements';
import { AutumnColors } from './AutumnColors';
import { Fruit } from './Fruit';
import { RangeSliderType } from './RangeSliderType';

export type ActionWithDetails = {
  enabled: boolean;
  time: string;
  amount?: string;
  type?: string | string[];
};

export type ActionWithSlider = {
  enabled: boolean;
  value: RangeSliderType;
};

export type Plant = {
  id?: number;
  initialId?: string;
  nameGerman: string;
  nameLatin: string;
  pruning: ActionWithDetails;
  fertilization: ActionWithDetails;
  soil: string;
  distance: ActionWithSlider;
  height: RangeSliderType;
  width: RangeSliderType;
  growth: string;
  growthForm: string[];
  leafShape: string;
  bloomTime: RangeSliderType;
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
};
