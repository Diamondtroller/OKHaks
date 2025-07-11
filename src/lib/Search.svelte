<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	interface Props {
		names: Record<string, any>;
		key: string;
		objects: any;
		Element: any;
		data: any;
	}

	let { names, key, objects, Element, data }: Props = $props();

	let query = $state('');

	const LIMIT = 20;
	const results = $derived.by(() => {
		let results: number[] = [];
		const lastNameId = Number(Object.keys(names).at(-1));
		const lastObjectId = Number(Object.keys(objects).at(-1));
		if (query.length === 0) return results;
		if (query[0] === '#') {
			const id_s = query.slice(1);
			if (id_s.endsWith('+')) {
				let id_n = parseInt(id_s.slice(0, -1));
				if (!isNaN(id_n)) {
					if (id_n < 0) id_n = 0;

					for (let id_i = id_n; results.length < LIMIT; id_i++) {
						if (names[id_i] || objects[id_i]) results.push(id_i);
						if (id_i > lastNameId && id_i > lastObjectId) break;
					}
				}
			} else {
				const id_n = parseInt(id_s);
				if (!isNaN(id_n)) {
					results.push(id_n);
				} else if (id_s === 'rand') {
					const k = Object.keys(names);
					const id = Math.ceil(k.length * Math.random());
					results.push(id);
				}
			}
		} else {
			for (const [id, name] of Object.entries(names)) {
				const id_n = Number(id);
				if (
					name[key].toLowerCase().includes(query.toLowerCase()) &&
					!isNaN(id_n) &&
					objects[id_n]
				) {
					results.push(id_n);
				}
				if (results.length >= LIMIT) break;
			}
		}
		if (results.length === 1) goto(`?id=${results[0]}`, { keepFocus: true, noScroll: true });
		return results;
	});
</script>

<div class="tcenter">
	<form method="dialog">
		<label
			>Meklēt:<input
				type="search"
				name="query"
				placeholder="nos. daļa / #id / #id+"
				autocomplete="off"
				bind:value={query}
			/></label
		>
		<button type="reset">X</button>
		<button
			type="button"
			onclick={async () => {
				query = '#rand';
				await tick();
				query = '';
			}}>Nejaušs</button
		>
	</form>
</div>

{#if results && results.length > 1}
	<div class="tcenter">
		{#each results as id}
			<Element {...data} {id} small fixed />
		{/each}
	</div>
{/if}
