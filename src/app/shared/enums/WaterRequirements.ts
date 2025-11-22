export enum WaterRequirement {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const WaterRequirementLabel: Record<WaterRequirement, string> = {
  [WaterRequirement.LOW]: 'Gering',
  [WaterRequirement.MEDIUM]: 'Mäßig',
  [WaterRequirement.HIGH]: 'Stark',
};

export const icons = {
  LOW: 'assets/icons/watering-low.png',
  MEDIUM: 'assets/icons/watering-medium.png',
  HIGH: 'assets/icons/watering-high.png',
};
