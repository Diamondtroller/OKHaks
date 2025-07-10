<!-- @migration-task Error while migrating Svelte code: `<tr>` cannot be a child of `<table>`. `<table>` only allows these children: `<caption>`, `<colgroup>`, `<tbody>`, `<thead>`, `<tfoot>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Task from '$lib/Task.svelte';
	import Item from '$lib/Item.svelte';
	import Quest from '$lib/Quest.svelte';
	import Search from '$lib/Search.svelte';
	import { actions, type } from '$lib/quests';

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
	<title>Uzdevumi{title_str}</title>
	<meta name="description" content="Uzdevumu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Uzdevumu informācijas meklētājs</h1>
{#await Promise.all([data.quests, data.stringsLV, data.items])}
	<Loading />
{:then fetchedData}
	{@const quests = fetchedData[0]}
	{@const stringsLV = fetchedData[1]}
	{@const items = fetchedData[2]}
	{@const task = quests.tasks[id]}
	<Search
		names={stringsLV.TASKS}
		key="NAME"
		objects={quests.tasks}
		Element={Task}
		data={{ quests: quests, stringsLV: stringsLV }}
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kāda uzdevuma nosaukumu vai nosaukuma daļu un atrodi informāciju par šo uzdevumu!
		</p>
	{:else}
		<h2><Task {quests} {stringsLV} {id} /></h2>
		{#if task}
			{#if stringsLV.TASKS[id]?.DESCRIPTION}
				<blockquote>{stringsLV.TASKS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if task?.action}
				<section>
					<h3>Uzdevumā darāmais</h3>
					<p>Šī ir tabula, kur teikts, kas šajā uzdevumā ir jādara.</p>
					<table class="tcenter" style:text-align="center">
						<thead>
							<tr>
								<th>Darbība</th>
								{#if task.ammount_max}
									<th>Daudzums</th>
								{/if}
								{#if task.target}
									<th>Mērķis</th>
								{/if}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style:font-size="1.5rem">{actions[task.action][0]}</td>
								{#if task.ammount_max}
									<td style:font-size="1.5rem">{task.ammount_max}</td>
								{/if}
								{#if task.target}
									<td>
										{#each task.target.split(',') as e_id}
											{#if actions[task.action][1] === type.item}
												<Item {items} {stringsLV} id={parseInt(e_id)} small />
											{:else if actions[task.action][1] === type.quest}
												<Quest {quests} {stringsLV} id={parseInt(e_id)} small />
											{:else if actions[task.action][1] === type.task}
												<Task {quests} {stringsLV} id={parseInt(e_id)} small />
											{:else if actions[task.action][1] === type.island}
												<div>{stringsLV.MAP_NAMES[parseInt(task.target)]}</div>
											{/if}
										{/each}
									</td>
								{/if}
							</tr>
						</tbody>
					</table>
				</section>
			{/if}
			{#if task.quest_id}
				<section>
					<h3>Virsmērķis</h3>
					<p>Uzdevums, ko šobrīd skati atbilst zemāk redzamajam uzdevumam.</p>
					<div class="tcenter"><Quest {quests} {stringsLV} id={parseInt(task.quest_id)} /></div>
				</section>
			{/if}
			{#if task.reward}
				<section>
					<h3>Uzdevuma sasniegšana apbalvojumu saraksts</h3>
					<p>
						Saraksts ar lietām, ko tu iegūsti, ja izpildīsi šo uzdevumu. Negatīva vērtība nozīmē, ka
						zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var iegūt šo lietu: 0.09 = 9%
						iespēja iegūt šo lietu.
					</p>
					<Table
						ColumnType={Item}
						data={{ items: items, stringsLV: stringsLV }}
						content={task.reward}
						className="tcenter"
					/>
				</section>
			{/if}

			<section>
				<details>
					<summary>Skatīt tīros datus</summary>
					<code>
						<pre>{JSON.stringify(task, null, 2)}</pre>
					</code>
				</details>
			</section>
		{/if}
	{/if}
{/await}
