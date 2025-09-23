<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Task from '$lib/Task.svelte';
	import Item from '$lib/Item.svelte';
	import Quest from '$lib/Quest.svelte';
	import Search from '$lib/Search.svelte';
	import { actions, type } from '$lib/quests';
	import { m } from '$lib/paraglide/messages.js';

	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	import { page } from '$app/state';

	const competition = $derived(page.url.searchParams.has('competition'));
	const id_str = $derived(page.url.searchParams.get('id'));
	const id = $derived.by(() => {
		const id_test = parseInt(id_str!);
		return isNaN(id_test) ? -1 : id_test;
	});
	const title_str = $derived(id === -1 ? '' : ` #${id_str}`);
</script>

<svelte:head>
	<title>{m['tasks.tasks']() + title_str}</title>
	<meta name="description" content={m['tasks.heading']()} />
</svelte:head>

<h1 class="tcenter">{m['tasks.heading']()}</h1>
{#await Promise.all([data.quests, data.strings, data.items])}
	<Loading />
{:then fetchedData}
	{@const quests = fetchedData[0]}
	{@const strings = fetchedData[1]}
	{@const strITEMS = competition ? strings.comITEMS : strings.ITEMS}
	{@const strQUESTS = competition ? strings.comQUESTS : strings.QUESTS}
	{@const strTASKS = competition ? strings.comTASKS : strings.TASKS}
	{@const items = fetchedData[2]}
	{@const task = quests.tasks[id]}
	<Search
		names={strTASKS}
		key="NAME"
		objects={quests.tasks}
		Element={Task}
		data={{ quests, strTASKS, competition }}
	/>
	{#if !id_str}
		<p class="tcenter">{m['tasks.description']()}</p>
	{:else}
		<h2><Task {quests} {strTASKS} {id} {competition} /></h2>
		{#if task}
			{#if strTASKS[id]?.DESCRIPTION}
				<blockquote>{strTASKS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if task?.action}
				<section>
					<h3>{m['tasks.action.heading']()}</h3>
					<p>{m['tasks.action.description']()}</p>
					<table class="tcenter" style:text-align="center">
						<tbody>
							<tr>
								<td style:font-size="1.5rem"
									>{m[('tasks.actions.' + task.action) as keyof typeof m]()}</td
								>
								{#if task.ammount_max}
									<td style:font-size="1.5rem">{task.ammount_max}</td>
								{/if}
								{#if task.target}
									<td>
										{#each task.target.split(',') as e_id}
											{#if actions[task.action] === type.item}
												<Item {items} {strITEMS} id={parseInt(e_id)} {competition} small />
											{:else if actions[task.action] === type.quest}
												<Quest {quests} {strQUESTS} id={parseInt(e_id)} {competition} small />
											{:else if actions[task.action] === type.task}
												<Task {quests} {strTASKS} id={parseInt(e_id)} {competition} small />
											{:else if actions[task.action] === type.island}
												<div>{strings.MAP_NAMES[parseInt(task.target)]}</div>
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
					<h3>{m['tasks.quest.heading']()}</h3>
					<p>{m['tasks.quest.description']()}</p>
					<div class="tcenter"><Quest {quests} {strQUESTS} id={parseInt(task.quest_id)} {competition} /></div>
				</section>
			{/if}
			{#if task.reward}
				<section>
					<h3>{m['tasks.reward.heading']()}</h3>
					<p>{m['tasks.reward.description']()}</p>
					<Table
						ColumnType={Item}
						data={{ items, strITEMS, competition }}
						content={task.reward}
						className="tcenter"
					/>
				</section>
			{/if}

			<section>
				<details>
					<summary>{m['rawData']()}</summary>
					<code>
						<pre>{JSON.stringify(task, null, 2)}</pre>
					</code>
				</details>
			</section>
		{/if}
	{/if}
{/await}
