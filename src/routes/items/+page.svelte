<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Item from '$lib/Item.svelte';
	import Search from '$lib/Search.svelte';
	import Quest from '$lib/Quest.svelte';

	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { page } from '$app/state';

	const id_str = $derived(page.url.searchParams.get('id') ?? '');
	const id = $derived.by(() => {
		const id_test = parseInt(id_str);
		return isNaN(id_test) ? -1 : id_test;
	});
  const title_str = $derived(id === -1 ? '' : ` #${id_str}`);
</script>

<svelte:head>
	<title>Lietas{title_str}</title>
	<meta name="description" content="Lietu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Lietu informācijas meklētājs</h1>
{#await Promise.all([data.items, data.stringsLV])}
	<Loading />
{:then fetchedData}
	{@const items = fetchedData[0]}
	{@const stringsLV = fetchedData[1]}
	{@const item = items.items[id]}
	<Search
		names={stringsLV.ITEMS}
		key="CAPTION"
		objects={items.items}
		Element={Item}
		data={{ items: items, stringsLV: stringsLV }}
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kādas lietas nosaukumu vai nosaukuma daļu un atrodi informāciju par šo lietu!
		</p>
	{:else}
		<h2 style="max-width: 100%;"><Item {items} {stringsLV} {id} /></h2>
		{#if item}
			{#if stringsLV.ITEMS[id]?.NOTE}
				<blockquote>{stringsLV.ITEMS[id].NOTE}</blockquote>
			{/if}
			<section>
				<h3>Vispārīga informācija</h3>
				<p>Vispārīga informācija par šo lietu.</p>
				<table class="tcenter">
					<tbody>
						{#if item.level}
							<tr>
								<th>Atbloķēšanās līmenis</th>
								<td class="value">{item.level}</td>
							</tr>
						{/if}
						{#if item.lifes}
							<tr>
								<th>Darbības reizes</th>
								<td class="value">{item.lifes}</td>
							</tr>
						{/if}
						{#if item.walkable}
							<tr>
								<th>Caurstaigājams lauciņš</th>
								<td class="value">{item.walkable === '1' ? 'Jā' : 'Nē'}</td>
							</tr>
						{/if}
						{#if item.movable}
							<tr>
								<th>Pārvietojams lauciņš</th>
								<td class="value">{item.movable === '1' ? 'Jā' : 'Nē'}</td>
							</tr>
						{/if}
						{#if item.superPrice && item.superPrice !== '-1'}
							<tr>
								<th>Rubīnu cena</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items: items, stringsLV: stringsLV }}
										content={`0:${item.superPrice}`}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.price && item.price !== '-1'}
							<tr>
								<th>Veikala cena</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items: items, stringsLV: stringsLV }}
										content={item.price}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.sellPrice && item.sellPrice !== '-1'}
							<tr>
								<th>Pārdošanas cena</th>
								<td
									><Table
										ColumnType={Item}
										data={{ items: items, stringsLV: stringsLV }}
										content={item.sellPrice}
										noborder
									/></td
								>
							</tr>
						{/if}
						{#if item.transform}
							<tr>
								<th>Pārvēršas par:</th>
								<td><Item {items} {stringsLV} id={parseInt(item.transform)} small /></td>
							</tr>
						{/if}
					</tbody>
				</table>
			</section>
			{#if item.quests}
				<section>
					<h3>Nepieciešamie mērķi</h3>
					<p>Šie mērķi ir jāsasniedz, lai šī lieta būtu pieejama.</p>
					{#await data.quests}
						<Loading />
					{:then quests}
						{#each item.quests.split(',') as quest_id}
							<div class="tcenter"><Quest {quests} {stringsLV} id={parseInt(quest_id)} /></div>
						{/each}
					{/await}
				</section>
			{/if}
			{#if item.reward}
				<section>
					<h3>Izmantošanas apbalvojumu varbūtības</h3>
					<p>
						Saraksts ar lietām, ko tu gūsti vai zaudē vācot šo lauciņu vai izmantojot šo lietu.
						Negatīva vērtība nozīmē, ka zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var
						iegūt šo lietu: 0.09 = 9% iespēja iegūt šo lietu. Šīs var arī būt būvēšanas izmaksas.
					</p>
					<Table
						ColumnType={Item}
						data={{ items: items, stringsLV: stringsLV }}
						content={item.reward}
						color
						className="tcenter"
					/>
				</section>
			{/if}
			{#if item.buildItems}
				<section>
					<h3>Pabeigšanas cena</h3>
					<p>Šīs lietas vajadzīgas, lai pabeigtu būvēt lauciņu.</p>
					<Table
						ColumnType={Item}
						data={{ items: items, stringsLV: stringsLV }}
						content={item.buildItems}
						className="tcenter"
					/>
				</section>
			{/if}
			{#if item.friendReward}
				<section>
					<h3>Izmantošanas apbalvojumu varbūtības pie draugiem</h3>
					<p>
						Līdzīgi kā iepriekšējā sadaļa, taču šie apbalvojumi pieejami šo lauciņu novācot pie
						draugiem.
					</p>
					<Table
						ColumnType={Item}
						data={{ items: items, stringsLV: stringsLV }}
						content={item.friendReward}
						color
						className="tcenter"
					/>
				</section>
			{/if}
			<section>
				<details>
					<summary>Skatīt tīros datus</summary>
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
