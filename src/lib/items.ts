import { getData } from "$lib/data";
import { writable } from "svelte/store";

export type Item = {
  type?: string;
  price?: string;
  superPrice?: string;
  sellPrice?: string;
  subtype?: string;
  iconClass?: string;
  store?: string;
  social?: string;
  allowedMaps?: string;
  itemClass?: string;
  dimension?: string;
  size?: string;
  layer?: string;
  walkable?: string;
  movable?: string;
  sellProtection?: string;
  lifes?: string;
  b?: string;
  timer?: string;
  level?: string;
  reward?: string;
  friendReward?: string;
  quests?: string;
  v?: string;
  transform?: string;
  ba?: string;
  storeType?: string;
  buildItems?: string;
  animation?: string;
  bfs?: string;
  travel?: string;
  walkingMultiplier?: string;
  discount?: string;
  showItems?: string;
  bonusType?: string;
  values?: string;
};

type Items = {
  items: Record<number, Item>;
};

export let items = writable(undefined as Items | undefined);
export const itemsp = getData("/data/items.json").then((v : Items) => items.set(v));
