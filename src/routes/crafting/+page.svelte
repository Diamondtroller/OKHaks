<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Item from '$lib/Item.svelte';
	import Craft from '$lib/Craft.svelte';
	import Search from '$lib/Search.svelte';
	import Quest from '$lib/Quest.svelte';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { page } from '$app/state';

	const competition = $derived(page.url.searchParams.has('competition'));
	const id_str = $derived(page.url.searchParams.get('id') ?? '');
	const id = $derived.by(() => {
		const id_test = parseInt(id_str);
		return isNaN(id_test) ? -1 : id_test;
	});
	const title_str = $derived(id === -1 ? '' : ` #${id_str}`);
	function time(seconds: number)  {
		return `${Math.floor(seconds/3600)}h ${Math.floor((seconds%3600)/60)}m ${seconds%60}s`;
	}
</script>

<svelte:head>
	<title>{m['crafting.crafting']() + title_str}</title>
	<meta name="description" content={m['crafting.heading']()} />
</svelte:head>

<h1 class="tcenter">{m['crafting.heading']()}</h1>
{#await Promise.all([data.crafting, data.strings])}
	<Loading />
{:then fetchedData}
	{@const crafting = fetchedData[0]}
	{@const strings = fetchedData[1]}
	{@const strCRAFTING = competition ? strings.comCRAFTING : strings.CRAFTING}
	{@const strITEMS = competition ? strings.comITEMS : strings.ITEMS}
	{@const strQUESTS = competition ? strings.comQUESTS : strings.QUESTS}
	{@const craft = crafting[id]}
	<Search
		names={strCRAFTING}
		keyGetter={(name) => name}
		objects={crafting}
		Element={Craft}
		data={{ crafting, strCRAFTING, competition }}
	/>
	{#if !id_str}
		<p class="tcenter">{m['crafting.description']()}</p>
	{:else}
		<h2 style="max-width: 100%;"><Craft {crafting} {strCRAFTING} {id} {competition} /></h2>
		{#if craft}
			<section>
				<h3>{m['crafting.generalInfo.label']()}</h3>
				<p>{m['crafting.generalInfo.description']()}</p>
				<table class="tcenter">
					<tbody>
						{#if craft.level}
							<tr>
								<th>{m['items.generalInfo.level']()}</th>
								<td class="value">{craft.level}</td>
							</tr>
						{/if}
						{#if craft.timer}
							<tr>
								<th>{m['crafting.generalInfo.time']()}</th>
								<td class="value">{time(craft.timer)}</td>
							</tr>
						{/if}
						{#if craft.max}
							<tr>
								<th>{m['crafting.generalInfo.max']()}</th>
								<td class="value">{craft.max === "0" ? m['crafting.generalInfo.infinite']() : craft.max }</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</section>
			{#if craft.quests}
				<section>
					<h3>{m['crafting.req_quests.heading']()}</h3>
					<p>{m['crafting.req_quests.description']()}</p>
					{#await data.quests}
						<Loading />
					{:then quests}
						{#each craft.quests.split(',') as quest_id}
							<div class="tcenter"><Quest {quests} {strQUESTS} id={parseInt(quest_id)} {competition} /></div>
						{/each}
					{/await}
				</section>
			{/if}
			{#if craft.reward}
				<section>
					<h3>{m['crafting.action.heading']()}</h3>
					<p>{m['crafting.action.description']()}</p>
					{#await data.items}
						<Loading />
					{:then items}
						<Table
							ColumnType={Item}
							data={{ items, strITEMS, competition }}
							content={craft.reward}
							split
							className="tcenter"
						/>
					{/await}
				</section>
			{/if}
			<section>
				<details>
					<summary>{m['rawData']()}</summary>
					<code>
						<pre>{JSON.stringify(craft, null, 2)}</pre>
					</code>
				</details>
			</section>
		{/if}
	{/if}
{/await}

<style>
	td {
		text-align: center;
	}
	th {
		text-align: right;
	}
</style>
