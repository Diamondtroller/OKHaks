import type { PageLoad } from './$types';
import type { Quests } from '$lib/quests';
import type { Items } from '$lib/items';
import type { Strings } from '$lib/strings';
import type { Crafts } from '$lib/crafting';

import { getData } from '$lib/data';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageLoad = ({ url, fetch }) => {
	const competition = url.searchParams.has("competition");

	const crafting = getData(fetch, competition ? '/data/comCrafting.json' : '/data/crafting.json') as Promise<Crafts>;
	const strings = getData(
		fetch,
		`/data/strings${getLocale().toUpperCase()}.json`
	) as Promise<Strings>;

	const craftingStrings = Promise.all([crafting, strings]);
	const quests = craftingStrings.then(
		() => getData(fetch, competition ? '/data/comQuests.json' : '/data/quests.json') as Promise<Quests>
	);
	const items = craftingStrings.then(
		() => getData(fetch, competition ? '/data/comItems.json' : '/data/items.json') as Promise<Items>
	);

	// waterfall items request to happen later
	return {
		crafting,
		strings,
		quests,
		items
	};
};
