export type StringsLV = {
  ITEMS: Record<number, { CAPTION: string; NOTE: string }>;
  QUESTS: Record<number, { NAME: string; DESCRIPTION: string }>;
  TASKS: Record<number, { NAME: string; DESCRIPTION: string }>;
  MAP_NAMES: Record<number, string>;
};
