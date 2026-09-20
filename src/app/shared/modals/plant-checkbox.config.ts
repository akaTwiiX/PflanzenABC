export const CHECKBOX_FIELDS = [
  'frostResistant',
  'evergreen',
  'dryTolerance',
  'edible',
  'toxic',
  'fragrant',
  'buckets',
  'bugsFriendly',
  'birdFriendly',
  'regional',
  'windFriendly',
  'stoloniferous',
] as const;

export type BooleanPlantKeys = (typeof CHECKBOX_FIELDS)[number];

export const CHECKBOX_LABELS: Record<BooleanPlantKeys, string> = {
  frostResistant: 'Winterhart',
  evergreen: 'Immergrün',
  dryTolerance: 'Trockenresistent',
  edible: 'Essbar',
  toxic: 'Giftig',
  fragrant: 'Duftend',
  buckets: 'Kübelgeeignet',
  bugsFriendly: 'Insektenfreundlich',
  birdFriendly: 'Vogelnährgehölz',
  regional: 'Einheimisch',
  windFriendly: 'Windverträglich',
  stoloniferous: 'Ausläuferbildend',
};

export const CHECKBOX_ICONS: Record<BooleanPlantKeys, string> = {
  frostResistant: 'snowflake.png',
  evergreen: 'leaf.png',
  dryTolerance: 'cactus.png',
  edible: 'eatable.png',
  toxic: 'skull.png',
  fragrant: 'nose.png',
  buckets: 'flower-pot.png',
  bugsFriendly: 'bug.png',
  birdFriendly: 'bird.png',
  regional: 'home.png',
  windFriendly: 'wind.png',
  stoloniferous: 'stoloniferous.png',
};

export interface CheckboxItem {
  name: BooleanPlantKeys;
  label: string;
  icon: string;
  checked: boolean;
}

export const CHECKBOX_ARRAY: CheckboxItem[] = CHECKBOX_FIELDS.map(field => ({
  name: field,
  label: CHECKBOX_LABELS[field],
  icon: CHECKBOX_ICONS[field],
  checked: false,
}));
