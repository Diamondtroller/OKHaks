import { getData } from "$lib/data";
import { writable } from "svelte/store";

type StringsLV = {
  ITEMS: Record<number, { CAPTION: string; NOTE: string }>;
  QUESTS: Record<number, { NAME: string; DESCRIPTION: string }>;
  TASKS: Record<number, { NAME: string; DESCRIPTION: string }>;
  MAP_NAMES: Record<number, string>;
};



export let stringsLV = writable(undefined as StringsLV | undefined);
export const stringsLVp = getData("/data/stringsLV.json").then((v: StringsLV) => { stringsLV.set(v) })
