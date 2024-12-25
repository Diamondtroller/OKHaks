import { getData } from "$lib/data";
import { writable } from "svelte/store";

export type Quest = {
  id?: string;
  type?: string;
  image?: string;
  req_quests?: string;
  reward?: string;
  timer?: string;
  cancelable?: string;
  social?: string;
  npc_texts?: string;
};
export type Task = {
  id?: string;
  quest_id?: string;
  icon?: string;
  action?: string;
  target?: string;
  rule?: string;
  ammount_max?: string;
  reward?: string;
  price?: string;
  island?: string;
  npc_texts?: string;
};

export const type = {
  none: 0,
  item: 1, // many
  quest: 2, // 1
  island: 3, // 1
  task: 4, // many
};

export const actions = {
  "animal_feed": ["Pabarot", type.item],
  "animal_heal": ["Izārtstēt", type.item],
  "bonus_activate": ["Aktivizēt", type.item],
  "building_finish": ["Pabeidz būvēt", type.item],
  "building_upgrade": ["Uzlabot būvi", type.item],
  "building_use": ["Izmantot būvi", type.item],
  "character_change": ["Nomainīt drēbes", type.none],
  "crafting_create": ["Izgatavot", type.item],
  "friend_do_work": ["Novākt pie drauga", type.item],
  "give_item": ["Iesniegt", type.item],
  "have_item": ["Savākt", type.item],
  "impossible": ["Neiespējami", type.item],
  "inventory_sell": ["Pārdot no somas", type.item],
  "inventory_use": ["Izmantot somā", type.item],
  "map_create_field": ["Rakt vagas", type.item],
  "map_harvest_field": ["Novākt", type.item],
  "map_object_create": ["Nolikt", type.item],
  "map_object_delete": ["Aizvākt", type.item],
  "map_object_have": ["Salā jābūt", type.item],
  "map_object_hp_change": ["Vākt/Būvēt", type.item],
  "map_object_move": ["Pārvietot", type.item],
  "map_object_remove": ["Novākt", type.item],
  "map_object_sell": ["Pārdot", type.item],
  "map_object_store": ["Noglabāt", type.item],
  "map_object_use": ["Spēlēt", type.item],
  "map_plant_field": ["Iestādīt", type.item],
  "map_visit": ["Apciemot", type.island],
  "npc_talk": ["Runāt ar", type.item],
  "quest_finish": ["Izpildīt mērķi", type.quest],
  "resources_collect": ["Iegūt", type.item],
  "resources_spend": ["Iztērēt", type.item],
  "shop_buy": ["Nopirkt", type.item],
  "task_finish": ["Izpildīt uzdevumu", type.task],
  "tractor_use": ["Izmantot traktoru", type.item],
  "undefined": ["Nezināms", type.none],
} as Record<string, any>;

type Quests = {
  quests: Record<number, Quest>;
  tasks: Record<number, Task>;
};

export let quests = writable(undefined as Quests | undefined);
export const questsp = getData("/data/quests.json").then((v : Quests) => quests.set(v));
