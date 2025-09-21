import type { PageLoad } from './$types';
import type { Quests } from '$lib/quests';
import type { Items } from '$lib/items';
import type { Strings } from '$lib/strings';

import { getData } from '$lib/data';
import { getLocale } from '$lib/paraglide/runtime';

export const load: PageLoad = ({ fetch }) => {
	const quests = getData(fetch, '/data/quests.json') as Promise<Quests>;
	const strings = getData(
		fetch,
		`/data/strings${getLocale().toUpperCase()}.json`
	) as Promise<Strings>;
	const items = getData(fetch, '/data/items.json') as Promise<Items>;
	// waterfall items request to happen later
	return {
		strings,
		quests,
		items
	};
};
