<script lang="ts">
	import type { Quests } from '$lib/quests';
	import type { StringsLV } from '$lib/stringsLV';

	interface Props {
		quests: Quests;
		stringsLV: StringsLV;
		id: number;
		small?: boolean;
		fixed?: boolean;
	}

	let { quests, stringsLV, id, small = false, fixed = false }: Props = $props();

	const icon = $derived.by(() => {
		const icon = quests.quests[id]?.image;
		if ([undefined, '', ' '].includes(icon)) return 'misteryTask';
		return icon;
	});
	const name = $derived(stringsLV.QUESTS[id]?.NAME ?? 'Nav atrasts');
</script>

<a href="/quests/?id={id}" data-sveltekit-noscroll class={{ fixed }}
	><img
		src="https://okeanija.draugiem.lv/html5/i/quest_icons/{icon}.png"
		alt={name}
		class={{ small }}
	/>{name} (#{id})</a
>

<style>
	img {
		max-width: 50%;
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
