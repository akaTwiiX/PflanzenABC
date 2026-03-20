export enum ChoiceName {
  PlantType = 'plantType',
  FertilizerType = 'fertilizerType',
  SoilType = 'soilType',
  RootSystem = 'rootSystem',
  GrowthForm = 'growthForm',
  LeafShape = 'leafShape',
}

export interface ChoiceEntry {
  id?: number;
  name: ChoiceName;
  value: string[];
  updatedAt: string;
}
