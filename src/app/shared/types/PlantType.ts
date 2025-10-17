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
  bloomTime: RangeSliderType;
  type: string;
  light: LightRequirement;
  watering: WaterRequirement;
  frostResistant: boolean;
  fruit: Fruit;
  leaf: boolean;
  dryTolerance: boolean;
  edible: boolean;
  toxic: boolean;
  fragrant: boolean;
  buckets: boolean;
  notice?: string;
  imageUrl?: string;
  updatedAt: string;
  createdAt?: string;
};
