<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		ColumnType: any;
		data: any;
		content: string;
		split?: boolean;
		className?: string;
		noborder?: boolean;
	}

	let {
		ColumnType,
		data,
		content,
		split = false,
		className = '',
		noborder = false
	}: Props = $props();

	let rows = $derived(
		content
			.split(',')
			.map((r) => r.split(':').map((r) => parseFloat(r)))
			.sort((a, b) => b[1] - a[1])
			.map((r) =>
				r[1] >= 1
					? { id: r[0], value: r[1], color: ' increase' }
					: r[1] < 0
						? { id: r[0], value: r[1], color: ' decrease' }
						: { id: r[0], value: `${Math.round(r[1] * 100)}%`, color: '' }
			)
	);
	let tworows = $derived(
		rows.reduce(
			(acc, cur) => {
				if (typeof cur.value === 'number' && cur.value < 0) acc[0].push(cur);
				else acc[1].push(cur);
				return acc;
			},
			[[], []]
		)
	);
</script>

{#if split}
	<div class="split">
	{#each tworows as rows, i}
		<table class={className}>
			{#if rows.length > 0}
			<caption>{[m["table.take"](), m["table.give"]()][i]}</caption>
			<tbody>
				{#each rows as row}
					<tr>
						<th class:noborder class={'label' + (split && row?.color)}>{row?.value}</th>
						<td class:noborder><ColumnType {...data} id={row?.id} small={true} /></td>
					</tr>
				{/each}
			</tbody>
		{/if}
		</table>
	{/each}
	</div>
{:else}
	<table class={className}>
		<tbody>
			{#each rows as row}
				<tr>
					<th class:noborder class={'label' + (split && row?.color)}>{row?.value}</th>
					<td class:noborder><ColumnType {...data} id={row?.id} small={true} /></td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	.label {
		font-size: 1.5em;
	}
	.decrease {
		color: #dd2424;
	}
	.increase {
		color: #3f9505;
	}
	.noborder {
		border: unset;
		padding: 0;
	}
	.split {
		align-self: center;
		display: flex;
		/* grid-template-columns: auto auto; */
		align-items: center;
		gap: 1vw;
		table {
			align-self: unset;
		}
	}
</style>
