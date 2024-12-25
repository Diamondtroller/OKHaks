<script lang="ts">
	import { page } from '$app/stores';
	import { stringsLV, stringsLVp } from '$lib/stringsLV';
	import { quests, questsp, type Quest as QuestInfo } from '$lib/quests';

	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Quest from '$lib/Quest.svelte';
	import Item from '$lib/Item.svelte';
	import Search from '$lib/Search.svelte';
	import Task from '$lib/Task.svelte';
	import { browser } from '$app/environment';

	let id_str: string, id: number, quest: QuestInfo, tasks: string[], nextQuests: string[];
	$: if (browser) {
		id_str = $page.url.searchParams.get('id')!;
		id = parseInt(id_str!);
		if (Number.isNaN(id)) id = -1;
		questsp.then(() => {
			quest = $quests.quests[id];
			tasks = Object.entries($quests.tasks)
				.filter((entry) => entry[1].quest_id == id_str)
				.map((entry) => entry[0]);
			nextQuests = Object.entries($quests.quests)
				.filter((entry) => entry[1].req_quests && entry[1].req_quests.split(',').includes(id_str))
				.map((entry) => entry[0]);
		});
	}
</script>

<svelte:head>
	<title>Mērķi</title>
	<meta name="description" content="Mērķu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Mērķu informācijas meklētājs</h1>
{#await Promise.all([questsp, stringsLVp])}
	<Loading />
{:then}
	<Search
		label="Mērķu filtrs:"
		names={$stringsLV.QUESTS}
		key="NAME"
		objects={$quests.quests}
		element={Quest}
		className="tcenter"
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kāda mērķa nosaukumu vai nosaukuma daļu un atrodi informāciju par šo mērķu(ne
			uzdevumu)!
		</p>
	{:else}
		<h2><Quest {id} /></h2>
		{#if quest}
			{#if $stringsLV.QUESTS[id]?.DESCRIPTION}
				<blockquote>{$stringsLV.QUESTS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if tasks.length !== 0}
				<h3>Mērķa uzdevumi</h3>
				<div class="tcenter">
					{#each tasks as task_id}
						<Task id={parseInt(task_id)} />
					{/each}
				</div>
			{/if}
			{#if quest.reward}
				<h3>Mērķa sasniegšana apbalvojumu saraksts</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>
						Saraksts ar lietām, ko tu iegūsti, ja sasniegsi šo mēŗķi. Negatīva vērtība nozīmē, ka
						zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var iegūt šo lietu: 0.09 = 9%
						iespēja iegūt šo lietu.
					</p>
				</details>
				<Table ColumnType={Item} content={quest.reward} className="tcenter" />
			{/if}
			{#if quest.req_quests}
				<h3>Nepieciešamie mērķi</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Šie mērķi ir jāsasniedz lai varētu pildīt šo mērķi.</p>
				</details>
				<div class="tcenter">
					{#each quest.req_quests.split(',') as quest_id}
						<Quest id={parseInt(quest_id)} />
					{/each}
				</div>
			{/if}
			{#if nextQuests.length > 0}
				<h3>Nākamie mērķi</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Šie mērķi sekos pēc šī mērķa sasniegšanas.</p>
				</details>
				<div class="tcenter">
					{#each nextQuests as quest_id}
						<Quest id={parseInt(quest_id)} />
					{/each}
				</div>
			{/if}

			<details>
				<summary>Skatīt tīros datus</summary>
				<code>
					<pre>{JSON.stringify(quest, null, 2)}</pre>
				</code>
			</details>
		{/if}
	{/if}
{/await}
