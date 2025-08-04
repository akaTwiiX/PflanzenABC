export enum LightRequirement {
  FULL_SUN = 'FULL_SUN',
  PARTIAL_SHADE = 'PARTIAL_SHADE',
  SHADE = 'SHADE',
}

export const LightRequirementLabel: Record<LightRequirement, string> = {
  [LightRequirement.FULL_SUN]: 'Sonne',
  [LightRequirement.PARTIAL_SHADE]: 'Halbschatten',
  [LightRequirement.SHADE]: 'Schatten',
};

export const icons = {
  FULL_SUN: 'assets/icon/full-sun.png',
  PARTIAL_SHADE: 'assets/icon/half-sun.png',
  SHADE: 'assets/icon/shade.png',
};
