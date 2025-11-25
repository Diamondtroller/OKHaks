export type Strings = {
	ITEMS: Record<number, { CAPTION: string; NOTE: string }>;
	QUESTS: Record<number, { NAME: string; DESCRIPTION: string }>;
	TASKS: Record<number, { NAME: string; DESCRIPTION: string }>;
	CRAFTING: Record<number, string>;
	MAP_NAMES: Record<number, string>;
};
