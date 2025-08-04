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
