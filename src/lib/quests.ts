export type Quest = {
	cancelable: string;
	id: string;
	image?: string;
	npc_texts?: string;
	req_quests?: string;
	reward?: string;
	social: string;
	timer?: string;
	type: string;
};

export type Task = {
	action?: string;
	ammount_max?: string;
	icon?: string;
	id: string;
	island?: string;
	npc_texts?: string;
	price?: string;
	quest_id: string;
	reward?: string;
	rule: string;
	target?: string;
};

export const type = {
	none: 0,
	item: 1, // many
	quest: 2, // 1
	island: 3, // 1
	task: 4 // many
};

export const actions = {
	animal_feed: type.item,
	animal_heal: type.item,
	bonus_activate: type.item,
	building_finish: type.item,
	building_upgrade: type.item,
	building_use: type.item,
	character_change: type.none,
	crafting_create: type.item,
	friend_do_work: type.item,
	give_item: type.item,
	have_item: type.item,
	impossible: type.item,
	inventory_sell: type.item,
	inventory_use: type.item,
	map_create_field: type.item,
	map_harvest_field: type.item,
	map_object_create: type.item,
	map_object_delete: type.item,
	map_object_have: type.item,
	map_object_hp_change: type.item,
	map_object_move: type.item,
	map_object_remove: type.item,
	map_object_sell: type.item,
	map_object_store: type.item,
	map_object_use: type.item,
	map_plant_field: type.item,
	map_visit: type.island,
	npc_talk: type.item,
	quest_finish: type.quest,
	resources_collect: type.item,
	resources_spend: type.item,
	shop_buy: type.item,
	task_finish: type.task,
	tractor_use: type.item,
	undefined: type.none
} as Record<string, any>;

export type Quests = {
	quests: Record<number, Quest>;
	tasks: Record<number, Task>;
};
