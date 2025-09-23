<script lang="ts">
	import Loading from '$lib/Loading.svelte';
	import Table from '$lib/Table.svelte';
	import Quest from '$lib/Quest.svelte';
	import Item from '$lib/Item.svelte';
	import Search from '$lib/Search.svelte';
	import Task from '$lib/Task.svelte';
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
	<title>{m['quests.quests']() + title_str}</title>
	<meta name="description" content={m['quests.heading']()} />
</svelte:head>

<h1 class="tcenter">{m['quests.heading']()}</h1>
{#await Promise.all([data.quests, data.strings])}
	<Loading />
{:then fetchedData}
	{@const quests = fetchedData[0]}
	{@const strings = fetchedData[1]}
	{@const strITEMS = competition ? strings.comITEMS : strings.ITEMS}
	{@const strQUESTS = competition ? strings.comQUESTS : strings.QUESTS}
	{@const strTASKS = competition ? strings.comTASKS : strings.TASKS}
	{@const quest = quests.quests[id]}
	{@const tasks = Object.entries(quests.tasks)
		.filter((entry) => entry[1].quest_id == id_str)
		.map((entry) => entry[0])}
	{@const nextQuests = Object.entries(quests.quests)
		.filter((entry) => entry[1].req_quests && entry[1].req_quests.split(',').includes(id_str!))
		.map((entry) => entry[0])}
	<Search
		names={strQUESTS}
		key="NAME"
		objects={quests.quests}
		Element={Quest}
		data={{ quests, strQUESTS, competition }}
	/>
	{#if !id_str}
		<p class="tcenter">{m['quests.description']()}</p>
	{:else}
		<h2><Quest {quests} {strQUESTS} {id} {competition} /></h2>
		{#if quest}
			{#if strQUESTS[id]?.DESCRIPTION}
				<blockquote>{strQUESTS[id].DESCRIPTION}</blockquote>
			{/if}
			{#if tasks.length !== 0}
				<section>
					<h3>{m['quests.tasks']()}</h3>
					<div class="tcenter">
						{#each tasks as task_id}
							<Task {quests} {strTASKS} id={parseInt(task_id)} {competition} />
						{/each}
					</div>
				</section>
			{/if}
			{#if quest.reward}
				<section>
					<h3>{m['quests.reward.heading']()}</h3>
					<p>{m['quests.reward.description']()}</p>
					{#await data.items}
						<Loading />
					{:then items}
						<Table
							ColumnType={Item}
							data={{ items, strITEMS, competition }}
							content={quest.reward}
							className="tcenter"
						/>
					{/await}
				</section>
			{/if}
			{#if quest.req_quests}
				<section>
					<h3>{m['quests.req_quests.heading']()}</h3>
					<p>{m['quests.req_quests.description']()}</p>
					<div class="tcenter">
						{#each quest.req_quests.split(',') as quest_id}
							<Quest {quests} {strQUESTS} id={parseInt(quest_id)} {competition} />
						{/each}
					</div>
				</section>
			{/if}
			{#if nextQuests.length > 0}
				<section>
					<h3>{m['quests.next_quests.heading']()}</h3>
					<p>{m['quests.next_quests.description']()}</p>
					<div class="tcenter">
						{#each nextQuests as quest_id}
							<Quest {quests} {strQUESTS} id={parseInt(quest_id)} {competition} />
						{/each}
					</div>
				</section>
			{/if}

			<section>
				<details>
					<summary>{m['rawData']()}</summary>
					<code>
						<pre>{JSON.stringify(quest, null, 2)}</pre>
					</code>
				</details>
			</section>
		{/if}
	{/if}
{/await}
