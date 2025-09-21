<script lang="ts">
	import type { Quests } from '$lib/quests';
	import type { Strings } from '$lib/strings';
	import { localizeHref } from './paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		quests: Quests;
		strings: Strings;
		id: number;
		small?: boolean;
		fixed?: boolean;
	}

	let { quests, strings, id, small = false, fixed = false }: Props = $props();

	const icon = $derived.by(() => {
		const icon = quests.tasks[id]?.icon;
		if ([undefined, '', ' '].includes(icon)) return 'misteryTaskB';
		return icon;
	});
	const name = $derived(strings.TASKS[id]?.NAME ?? m['notFound']());
</script>

<a href={localizeHref(`/quests/tasks/?id=${id}`)} data-sveltekit-noscroll class={{ fixed }}
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
