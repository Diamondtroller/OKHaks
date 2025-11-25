export type Craft = {
	iconClass?: string,
	island?: string,
	level?: string,
	max?: string,
	order?: string,
	quests?: string,
	reward?: string,
	show?: string,
	social?: string,
	subtype?: string,
	timer?: string
};

export type Crafts = Record<number, Craft>;
