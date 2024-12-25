<script lang="ts">
	import { page } from '$app/stores';
	import { items, itemsp, type Item as ItemInfo } from '$lib/items';
	import { stringsLV, stringsLVp } from '$lib/stringsLV';

	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Item from '$lib/Item.svelte';
	import Search from '$lib/Search.svelte';
	import Quest from '$lib/Quest.svelte';
	import { browser } from '$app/environment';

	let id_str: string,
		id: number,
		item: ItemInfo | undefined = undefined;
	$: if (browser) {
		id_str = $page.url.searchParams.get('id')!;
		id = parseInt(id_str!);
		if (Number.isNaN(id)) id = -1;
		itemsp.then(() => {
			item = $items.items[id];
		});
	}
</script>

<svelte:head>
	<title>Lietas</title>
	<meta name="description" content="Lietu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Lietu informācijas meklētājs</h1>
{#await Promise.all([itemsp, stringsLVp])}
	<Loading />
{:then}
	<Search
		label="Lietu filtrs:"
		names={$stringsLV.ITEMS}
		key="CAPTION"
		objects={$items.items}
		element={Item}
		className="tcenter"
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kādas lietas nosaukumu vai nosaukuma daļu un atrodi informāciju par šo lietu!
		</p>
	{:else}
		<h2><Item {id} /></h2>
		{#if item}
			{#if $stringsLV.ITEMS[id]?.NOTE}
				<blockquote>{$stringsLV.ITEMS[id].NOTE}</blockquote>
			{/if}
			<h3>Vispārīga informācija</h3>
			<table class="tcenter">
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
						<td><Table ColumnType={Item} content={`0:${item.superPrice}`} noborder /></td>
					</tr>
				{/if}
				{#if item.price && item.price !== '-1'}
					<tr>
						<th>Veikala cena</th>
						<td><Table ColumnType={Item} content={item.price} noborder /></td>
					</tr>
				{/if}
				{#if item.sellPrice && item.sellPrice !== '-1'}
					<tr>
						<th>Pārdošanas cena</th>
						<td><Table ColumnType={Item} content={item.sellPrice} noborder /></td>
					</tr>
				{/if}
				{#if item.transform}
					<tr>
						<th>Pārvēršas par:</th>
						<td><Item id={item.transform} small /></td>
					</tr>
				{/if}
			</table>
			{#if item.quests}
				<h3>Nepieciešamie mērķi</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Šie mērķi ir jāsasniedz, lai šī lieta būtu pieejama.</p>
				</details>
				{#each item.quests.split(',') as quest_id}
					<div class="tcenter"><Quest id={parseInt(quest_id)} /></div>
				{/each}
			{/if}
			{#if item.reward}
				<h3>Izmantošanas apbalvojumu varbūtības</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>
						Saraksts ar lietām, ko tu gūsti vai zaudē vācot šo lauciņu vai izmantojot šo lietu.
						Negatīva vērtība nozīmē, ka zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var
						iegūt šo lietu: 0.09 = 9% iespēja iegūt šo lietu. Šīs var arī būt būvēšanas izmaksas.
					</p>
				</details>
				<Table ColumnType={Item} content={item.reward} color className="tcenter" />
			{/if}
			{#if item.buildItems}
				<h3>Pabeigšanas cena</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Šīs lietas vajadzīgas, lai pabeigtu būvēt lauciņu.</p>
				</details>
				<Table ColumnType={Item} content={item.buildItems} className="tcenter" />
			{/if}
			{#if item.friendReward}
				<h3>Izmantošanas apbalvojumu varbūtības pie draugiem</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>
						Līdzīgi kā iepriekšējā sadaļa, taču šie apbalvojumi pieejami šo lauciņu novācot pie
						draugiem.
					</p>
				</details>
				<Table ColumnType={Item} content={item.friendReward} color className="tcenter" />
			{/if}
			<details>
				<summary>Skatīt tīros datus</summary>
				<code>
					<pre>{JSON.stringify(item, null, 2)}</pre>
				</code>
			</details>
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
