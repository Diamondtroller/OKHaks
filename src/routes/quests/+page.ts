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
  const quests = getData(fetch, "/data/quests.json") as Promise<Quests>;
  const stringsLV = getData(fetch, "/data/stringsLV.json") as Promise<StringsLV>;
  const items = Promise.all([quests, stringsLV]).then(() => getData(fetch, "/data/items.json") as Promise<Items>);
  // waterfall items request to happen later
  return {
    stringsLV: stringsLV,
    quests: quests,
    items: items,
  }
};
