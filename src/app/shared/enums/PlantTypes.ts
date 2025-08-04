export enum PlantTypes {
  HERB = 'HERB',
  SHRUB = 'SHRUB',
  TREE = 'TREE',
  CLIMBER = 'CLIMBER',
}

export const PlantTypeLabel: Record<PlantTypes, string> = {
  [PlantTypes.HERB]: 'Kraut',
  [PlantTypes.SHRUB]: 'Strauch',
  [PlantTypes.TREE]: 'Baum',
  [PlantTypes.CLIMBER]: 'Kletterpflanze',
};
