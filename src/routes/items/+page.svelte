<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Item from '$lib/Item.svelte';
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
</script>

<svelte:head>
	<title>{m['items.items']() + title_str}</title>
	<meta name="description" content={m['items.heading']()} />
</svelte:head>

<h1 class="tcenter">{m['items.heading']()}</h1>
{#await Promise.all([data.items, data.strings])}
	<Loading />
{:then fetchedData}
	{@const items = fetchedData[0]}
	{@const strings = fetchedData[1]}
	{@const strITEMS = competition ? strings.comITEMS : strings.ITEMS}
	{@const strQUESTS = competition ? strings.comQUESTS : strings.QUESTS}
	{@const item = items.items[id]}
	<Search
		names={strITEMS}
		keyGetter={(name) => name.CAPTION}
		objects={items.items}
		Element={Item}
		data={{ items, strITEMS, competition }}
	/>
	{#if !id_str}
		<p class="tcenter">{m['items.description']()}</p>
	{:else}
		<h2 style="max-width: 100%;"><Item {items} {strITEMS} {id} {competition} /></h2>
		{#if item}
			{#if strITEMS[id]?.NOTE}
				<blockquote>{strITEMS[id].NOTE}</blockquote>
			{/if}
			<section>
				<h3>{m['items.generalInfo.label']()}</h3>
				<p>{m['items.generalInfo.description']()}</p>
				<table class="tcenter">
					<tbody>
						{#if item.level}
							<tr>
								<th>{m['items.generalInfo.level']()}</th>
								<td class="value">{item.level}</td>
							</tr>
						{/if}
						{#if item.lifes}
							<tr>
								<th>{m['items.generalInfo.lifes']()}</th>
								<td class="value">{item.lifes}</td>
							</tr>
						{/if}
						{#if item.walkable}
							<tr>
								<th>{m['items.generalInfo.walkable']()}</th>
								<td class="value">{item.walkable === '1' ? m.yes() : m.no()}</td>
							</tr>
						{/if}
						{#if item.movable}
							<tr>
								<th>{m['items.generalInfo.movable']()}</th>
								<td class="value">{item.movable === '1' ? m.yes() : m.no()}</td>
							</tr>
						{/if}
						{#if item.superPrice && item.superPrice !== '-1'}
							<tr>
								<th>{m['items.generalInfo.superPrice']()}</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items, strITEMS, competition }}
										content={`0:${item.superPrice}`}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.price && item.price !== '-1'}
							<tr>
								<th>{m['items.generalInfo.price']()}</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items, strITEMS, competition }}
										content={item.price}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.sellPrice && item.sellPrice !== '-1'}
							<tr>
								<th>{m['items.generalInfo.sellPrice']()}</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items, strITEMS, competition }}
										content={item.sellPrice}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.transform}
							<tr>
								<th>{m['items.generalInfo.transform']()}</th>
								<td><Item {items} {strITEMS} id={parseInt(item.transform)} {competition} small /></td>
							</tr>
						{/if}
					</tbody>
				</table>
			</section>
			{#if item.quests}
				<section>
					<h3>{m['items.quests.heading']()}</h3>
					<p>{m['items.quests.description']()}</p>
					{#await data.quests}
						<Loading />
					{:then quests}
						{#each item.quests.split(',') as quest_id}
							<div class="tcenter"><Quest {quests} {strQUESTS} id={parseInt(quest_id)} {competition} /></div>
						{/each}
					{/await}
				</section>
			{/if}
			{#if item.reward}
				<section>
					<h3>{m['items.rewards.heading']()}</h3>
					<p>{m['items.rewards.description']()}</p>
					<Table
						ColumnType={Item}
						data={{ items, strITEMS, competition }}
						content={item.reward}
						split
						className="tcenter"
					/>
				</section>
			{/if}
			{#if item.buildItems}
				<section>
					<h3>{m['items.buildItems.heading']()}</h3>
					<p>{m['items.buildItems.description']()}</p>
					<Table
						ColumnType={Item}
						data={{ items, strITEMS, competition }}
						content={item.buildItems}
						className="tcenter"
					/>
				</section>
			{/if}
			{#if item.friendReward}
				<section>
					<h3>{m['items.friendRewards.heading']()}</h3>
					<p>{m['items.friendRewards.description']()}</p>
					<Table
						ColumnType={Item}
						data={{ items, strITEMS, competition }}
						content={item.friendReward}
						split
						className="tcenter"
					/>
				</section>
			{/if}
			<section>
				<details>
					<summary>{m['rawData']()}</summary>
					<code>
						<pre>{JSON.stringify(item, null, 2)}</pre>
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
