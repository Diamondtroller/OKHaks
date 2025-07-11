import type { PageLoad } from './$types';
import type { Quests } from '$lib/quests';
import type { Items } from '$lib/items';
import type { Strings } from '$lib/strings';

import { getData } from '$lib/data';

export const load: PageLoad = ({ fetch }) => {
	const quests = getData(fetch, '/data/quests.json') as Promise<Quests>;
	const strings = getData(fetch, '/data/stringsLV.json') as Promise<Strings>;
	const items = Promise.all([quests, strings]).then(
		() => getData(fetch, '/data/items.json') as Promise<Items>
	);
	// waterfall items request to happen later
	return {
		strings: strings,
		quests: quests,
		items: items
	};
};
