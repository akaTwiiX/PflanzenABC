import { LightRequirement } from '../enums/LightRequirements';
import { PlantTypes } from '../enums/PlantTypes';
import { WaterRequirement } from '../enums/WaterRequirements';
import { Fruit } from './Fruit';
import { RangeSliderType } from './RangeSliderType';

export type ActionWithDetails = {
  enabled: boolean;
  time: string;
  amount?: string;
  type?: string;
};

export type Plant = {
  id?: number;
  initialId?: string;
  nameGerman: string;
  nameLatin: string;
  pruning: ActionWithDetails;
  fertilization: ActionWithDetails;
  soil: string;
  distance: RangeSliderType;
  height: RangeSliderType;
  width: RangeSliderType;
  growth: string;
  bloomTime: RangeSliderType;
  type: string;
  light: LightRequirement[];
  watering: WaterRequirement;
  frostResistant: boolean;
  fruit: Fruit;
  bloomColor: string[];
  leafColor: string[];
  requiredArea: RangeSliderType;
  rootSystem: string;
  evergreen: boolean;
  windFriendly: boolean;
  bugsFriendly: boolean;
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
