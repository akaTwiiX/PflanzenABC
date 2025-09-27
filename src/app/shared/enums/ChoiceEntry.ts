export enum ChoiceName {
    PlantType = 'plantType',
    FertilizerType = 'fertilizerType',
    SoilType = 'soilType'
}


export interface ChoiceEntry {
    id?: number;
    name: ChoiceName;
    value: string[];
}