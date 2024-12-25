<script lang="ts">
	import { page } from '$app/stores';
	import { stringsLV, stringsLVp } from '$lib/stringsLV';
	import { quests, questsp, actions, type, type Task as TaskInfo } from '$lib/quests';

	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Task from '$lib/Task.svelte';
	import Item from '$lib/Item.svelte';
	import Quest from '$lib/Quest.svelte';
	import Search from '$lib/Search.svelte';
	import { browser } from '$app/environment';

	let id_str: string, id: number, task: TaskInfo;
	$: if (browser) {
		id_str = $page.url.searchParams.get('id')!;
		id = parseInt(id_str!);
		if (Number.isNaN(id)) id = -1;
		questsp.then(() => {
			task = $quests.tasks[id];
		});
	}
</script>

<svelte:head>
	<title>Uzdevumi</title>
	<meta name="description" content="Uzdevumu informācijas meklētājs" />
</svelte:head>

<h1 class="tcenter">Uzdevumu informācijas meklētājs</h1>
{#await Promise.all([stringsLVp, questsp])}
	<Loading />
{:then}
	<Search
		label="Uzdevumu filtrs:"
		names={$stringsLV.TASKS}
		key="NAME"
		objects={$quests.tasks}
		element={Task}
		className="tcenter"
	/>
	{#if !id_str}
		<p class="tcenter">
			Ieraksti kāda uzdevuma nosaukumu vai nosaukuma daļu un atrodi informāciju par šo uzdevumu!
		</p>
	{:else}
		<h2><Task {id} /></h2>
		{#if task}
			{#if $stringsLV.TASKS[id]?.DESCRIPTION}
				<blockquote>{$stringsLV.TASKS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if task?.action}
				<h3>Uzdevumā darāmais</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Kas šajā uzdevumā ir jādara.</p>
				</details>
				<table class="tcenter" style:text-align="center">
					<tr>
						<th>Darbība</th>
						{#if task.ammount_max}
							<th>Daudzums</th>
						{/if}
						{#if task.target}
							<th>Mērķis</th>
						{/if}
					</tr>
					<tr>
						<td style:font-size="1.5rem">{actions[task.action][0]}</td>
						{#if task.ammount_max}
							<td style:font-size="1.5rem">{task.ammount_max}</td>
						{/if}
						{#if task.target}
							<td>
								{#each task.target.split(',') as e_id}
									{#if actions[task.action][1] === type.item}
										<Item id={parseInt(e_id)} small />
									{:else if actions[task.action][1] === type.quest}
										<Quest id={parseInt(e_id)} small />
									{:else if actions[task.action][1] === type.task}
										<Task id={parseInt(e_id)} small />
									{:else if actions[task.action][1] === type.island}
										<div>{$stringsLV.MAP_NAMES[parseInt(task.target)]}</div>
									{/if}
								{/each}
							</td>
						{/if}
					</tr>
				</table>
			{/if}
			{#if task.quest_id}
				<h3>Virsmērķis</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>Uzdevums, ko šobrīd skati atbilst zemāk redzamajam uzdevumam.</p>
				</details>
				<div class="tcenter"><Quest id={parseInt(task.quest_id)} /></div>
			{/if}
			{#if task.reward}
				<h3>Uzdevuma sasniegšana apbalvojumu saraksts</h3>
				<details>
					<summary>Par šo sadaļu</summary>
					<p>
						Saraksts ar lietām, ko tu iegūsti, ja izpildīsi šo uzdevumu. Negatīva vērtība nozīmē, ka
						zaudē šo lietu, daļskaitlis izsaka varbūtību ar kādu var iegūt šo lietu: 0.09 = 9%
						iespēja iegūt šo lietu.
					</p>
				</details>
				<Table ColumnType={Item} content={task.reward} className="tcenter" />
			{/if}

			<details>
				<summary>Skatīt tīros datus</summary>
				<code>
					<pre>{JSON.stringify(task, null, 2)}</pre>
				</code>
			</details>
		{/if}
	{/if}
{/await}
