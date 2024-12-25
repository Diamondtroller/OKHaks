<script lang="ts">
	import { goto } from '$app/navigation';

	export let label: string;
	export let names: Record<string, any>;
	export let key: string;
	export let objects: any;
	export let element: any;
	export let className = '';

	let query: string;
	let open = true;

	let results: number[];
	function getMatches(query: string) {
		const results = [];
		if (query[0] === '#') {
			const id_n = parseInt(query.slice(1));
			if (names[id_n] && objects[id_n]) {
				results.push(id_n);
			}
		} else {
			for (const [id, name] of Object.entries(names)) {
				const id_n = parseInt(id);
				if (name[key].toLowerCase().search(query) !== -1 && objects[id_n]) {
					results.push(id_n);
				}
				if (results.length >= 20) {
					break;
				}
			}
		}
		if (results.length === 1) {
			goto(`?id=${results.at(0)}`);
      return [];
		}
		return results;
	}
	function closeMatches(ev?: MouseEvent | KeyboardEvent) {
		if (ev instanceof KeyboardEvent) {
			if (ev.code !== 'Enter') {
				return;
			}
		}
		open = false;
	}
</script>

<div class={className}>
	<form
		id="filter"
		method="dialog"
		on:submit={() => {
			open = true;
			results = getMatches(query);
		}}
	>
		<fieldset>
			<label for="query">{label}</label>
			<input
				type="search"
				name="query"
				id="query"
        placeholder="nos. daļa vai #id"
				bind:value={query}
			/>
			<button type="submit">Meklēt</button>
		</fieldset>
	</form>
	{#if results && results.length > 0}
		<details bind:open>
			<summary>Meklēšanas rezultāti ({results.length})</summary>
			{#each results as id}
				<div on:click={closeMatches} on:keydown={closeMatches} role="link" tabindex="0">
					<svelte:component this={element} {id} small={true} />
				</div>
			{/each}
		</details>
	{/if}
</div>
