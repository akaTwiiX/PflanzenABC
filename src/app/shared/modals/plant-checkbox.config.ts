import { Plant } from '@/types/PlantType';

export const CHECKBOX_FIELDS = [
  'frostResistant',
  'evergreen',
  'dryTolerance',
  'edible',
  'toxic',
  'fragrant',
  'buckets',
  'bugsFriendly',
  'windFriendly',
] as const;

export type BooleanPlantKeys = (typeof CHECKBOX_FIELDS)[number];

export const CHECKBOX_LABELS: Record<BooleanPlantKeys, string> = {
  frostResistant: 'Winterhart',
  evergreen: 'Immergrün',
  dryTolerance: 'Trockenresistent',
  edible: 'Essbar',
  toxic: 'Giftig',
  fragrant: 'Duftend',
  buckets: 'Topfgeeignet',
  bugsFriendly: 'Insektenfreundlich',
  windFriendly: 'Windfreundlich',
};

export type CheckboxItem = {
  name: BooleanPlantKeys;
  label: string;
  checked: boolean;
};

export const CHECKBOX_ARRAY: CheckboxItem[] = CHECKBOX_FIELDS.map((field) => ({
  name: field,
  label: CHECKBOX_LABELS[field],
  checked: false,
}));
