import { LightRequirement } from '../enums/LightRequirements';
import { PlantTypes } from '../enums/PlantTypes';
import { WaterRequirement } from '../enums/WaterRequirements';
import { Fruit } from './Fruit';
import { RangeSliderType } from './RangeSliderType';

export type ActionWithDetails = {
  enabled: boolean; // z. B. Checkbox an/aus
  time: string;     // Zeitpunkt (z. B. "Frühjahr", "März", "alle 2 Wochen")
  amount?: string;  // nur wenn relevant, z. B. "20g"
  type?: string;    // z. B. Düngerart
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
  type: PlantTypes;
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
};
