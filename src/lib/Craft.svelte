<script lang="ts">
	import type { Strings } from '$lib/strings';
	import type { Crafts } from '$lib/crafting';
	import { localizeHref } from './paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		crafting: Crafts;
		strCRAFTING: Strings["CRAFTING"];
		id: number;
		competition?: boolean;
		small?: boolean;
		fixed?: boolean;
	}

	let { crafting, strCRAFTING, id, competition = false, small = false, fixed = false }: Props = $props();

	const icon = $derived.by(() => {
		const icon = crafting[id]?.iconClass;
		if ([undefined, '', ' '].includes(icon)) return 'misteryTaskB';
		return icon;
	});
	const name = $derived(strCRAFTING[id] ?? m['notFound']());
</script>

<a href={localizeHref(`/crafting/?id=${id}${competition ? '&competition' : ''}`)} data-sveltekit-noscroll class={{ fixed }}
	><img
		src="https://okeanija.draugiem.lv/html5/i/item_icons/{icon}.png"
		alt={name}
		class={{ small }}
	/>{name} (#{id})</a
>

<style>
	img {
		max-width: 50vw;
		object-fit: contain;
		object-position: left top;
		flex-basis: content;
		&.small {
			height: 1.5rem;
		}
	}
	a {
		display: flex;
		align-items: center;
		padding: 0.1rem;
		gap: 0.1rem;
		&.fixed {
			width: 18em;
		}
	}
</style>
