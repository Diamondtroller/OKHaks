<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Quest from '$lib/Quest.svelte';
	import Item from '$lib/Item.svelte';
	import Search from '$lib/Search.svelte';
	import Task from '$lib/Task.svelte';

	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { page } from '$app/state';

	const id_str = $derived(page.url.searchParams.get('id'));
	const id = $derived.by(() => {
		const id_test = parseInt(id_str!);
		return isNaN(id_test) ? -1 : id_test;
	});
	const title_str = $derived(id === -1 ? '' : ` #${id_str}`);
</script>

<svelte:head>
	<title>Mērķi{title_str}</title>
	<meta name="description" content="Mērķu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Mērķu informācijas meklētājs</h1>
{#await Promise.all([data.quests, data.stringsLV])}
	<Loading />
{:then fetchedData}
	{@const quests = fetchedData[0]}
	{@const stringsLV = fetchedData[1]}
	{@const quest = quests.quests[id]}
	{@const tasks = Object.entries(quests.tasks)
		.filter((entry) => entry[1].quest_id == id_str)
		.map((entry) => entry[0])}
	{@const nextQuests = Object.entries(quests.quests)
		.filter((entry) => entry[1].req_quests && entry[1].req_quests.split(',').includes(id_str!))
		.map((entry) => entry[0])}
	<Search
		names={stringsLV.QUESTS}
		key="NAME"
		objects={quests.quests}
		Element={Quest}
		data={{ quests: quests, stringsLV: stringsLV }}
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kāda mērķa nosaukumu vai nosaukuma daļu un atrodi informāciju par šo mērķu(ne
			uzdevumu)!
		</p>
	{:else}
		<h2><Quest {quests} {stringsLV} {id} /></h2>
		{#if quest}
			{#if stringsLV.QUESTS[id]?.DESCRIPTION}
				<blockquote>{stringsLV.QUESTS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if tasks.length !== 0}
				<section>
					<h3>Mērķa uzdevumi</h3>
					<div class="tcenter">
						{#each tasks as task_id}
							<Task {quests} {stringsLV} id={parseInt(task_id)} />
						{/each}
					</div>
				</section>
			{/if}
			{#if quest.reward}
				<section>
					<h3>Mērķa sasniegšana apbalvojumu saraksts</h3>
					<p>
						Saraksts ar lietām, ko tu iegūsti, ja sasniegsi šo mēŗķi. Negatīva vērtība nozīmē, ka
						zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var iegūt šo lietu: 0.09 = 9%
						iespēja iegūt šo lietu.
					</p>
					{#await data.items}
						<Loading />
					{:then items}
						<Table
							ColumnType={Item}
							data={{ items: items, stringsLV: stringsLV }}
							content={quest.reward}
							className="tcenter"
						/>
					{/await}
				</section>
			{/if}
			{#if quest.req_quests}
				<section>
					<h3>Nepieciešamie mērķi</h3>
					<p>Šie mērķi ir jāsasniedz lai varētu pildīt šo mērķi.</p>
					<div class="tcenter">
						{#each quest.req_quests.split(',') as quest_id}
							<Quest {quests} {stringsLV} id={parseInt(quest_id)} />
						{/each}
					</div>
				</section>
			{/if}
			{#if nextQuests.length > 0}
				<section>
					<h3>Nākamie mērķi</h3>
					<p>Šie mērķi sekos pēc šī mērķa sasniegšanas.</p>
					<div class="tcenter">
						{#each nextQuests as quest_id}
							<Quest {quests} {stringsLV} id={parseInt(quest_id)} />
						{/each}
					</div>
				</section>
			{/if}

			<section>
				<details>
					<summary>Skatīt tīros datus</summary>
					<code>
						<pre>{JSON.stringify(quest, null, 2)}</pre>
					</code>
				</details>
			</section>
		{/if}
	{/if}
{/await}
