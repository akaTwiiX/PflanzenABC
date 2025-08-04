import { LightRequirement } from '../enums/LightRequirements';
import { PlantTypes } from '../enums/PlantTypes';
import { WaterRequirement } from '../enums/WaterRequirements';
import { RangeSliderType } from './RangeSliderType';

export type Plant = {
  id?: string;
  nameGerman: string;
  nameLatin: string;
  pruning: string;
  fertilization: string;
  soil: string;
  distance: RangeSliderType;
  height: RangeSliderType; // z. B. "30–80 cm"
  bloomTime: RangeSliderType;
  type: PlantTypes;
  light: LightRequirement;
  watering: WaterRequirement;
  frostResistant: boolean;
  fruit: boolean;
  leaf: boolean;
  dryTolerance: boolean;
  edible: boolean;
  toxic: boolean;
  fragrant: boolean;
  buckets: boolean;
  notice?: string;
  imageUrl?: string;
};
