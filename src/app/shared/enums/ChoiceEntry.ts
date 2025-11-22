export enum ChoiceName {
  PlantType = 'plantType',
  FertilizerType = 'fertilizerType',
  SoilType = 'soilType',
  RootSystem = 'rootSystem',
}

export interface ChoiceEntry {
  id?: number;
  name: ChoiceName;
  value: string[];
  updatedAt: string;
}
