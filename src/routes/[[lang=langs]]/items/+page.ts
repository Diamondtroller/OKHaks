import type { PageLoad } from './$types';
import type { Quests } from '$lib/quests';
import type { Items } from '$lib/items';
import type { Strings } from '$lib/strings';

import { getData } from '$lib/data';

export const load: PageLoad = ({ fetch }) => {
	const items = getData(fetch, '/data/items.json') as Promise<Items>;
	const strings = getData(fetch, '/data/stringsLV.json') as Promise<Strings>;
	const quests = Promise.all([items, strings]).then(
		() => getData(fetch, '/data/quests.json') as Promise<Quests>
	);
	// waterfall items request to happen later
	return {
		items: items,
		strings: strings,
		quests: quests
	};
};
