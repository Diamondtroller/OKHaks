import { getData } from "$lib/data";
import { writable } from "svelte/store";

type StringsEN = {
  ITEMS: Record<number, { CAPTION: string; NOTE: string }>;
  QUESTS: Record<number, { NAME: string; DESCRIPTION: string }>;
  TASKS: Record<number, { NAME: string; DESCRIPTION: string }>;
  MAP_NAMES: Record<number, string>;
};



export const stringsEN = writable(undefined as StringsEN | undefined);
export const stringsENp = getData("/data/stringsEN.json").then((v: StringsEN) => { stringsEN.set(v) })
