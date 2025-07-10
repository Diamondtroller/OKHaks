export const prerender = true;
export const csr = true;
export const ssr = false;
export const trailingSlash = 'always';

import type { PageLoad } from './$types';
import type { Quests } from '$lib/quests';
import type { Items } from '$lib/items';
import type { StringsLV } from '$lib/stringsLV';

import { getData } from '$lib/data';

export const load: PageLoad = ({ fetch }) => {
  const items = getData(fetch, "/data/items.json") as Promise<Items>;
  const stringsLV = getData(fetch, "/data/stringsLV.json") as Promise<StringsLV>;
  const quests = Promise.all([items, stringsLV]).then(() => getData(fetch, "/data/quests.json") as Promise<Quests>);
  // waterfall items request to happen later
  return {
    items: items,
    stringsLV: stringsLV,
    quests: quests,
  }
};
