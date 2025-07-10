<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
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
		const icon = quests.tasks[id]?.icon;
		if ([undefined, '', ' '].includes(icon)) return 'misteryTask';
		return icon;
	});
	const name = $derived(stringsLV.TASKS[id]?.NAME ?? 'Nav atrasts');
</script>

<a href="/quests/tasks/?id={id}" data-sveltekit-noscroll class={{ fixed }}
	><img
		src="https://okeanija.draugiem.lv/html5/i/quest_icons/{icon}.png"
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
