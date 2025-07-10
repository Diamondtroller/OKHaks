<script lang="ts">
	interface Props {
		ColumnType: any;
		data: any;
		content: string;
		color?: boolean;
		className?: string;
		noborder?: boolean;
	}

	let {
		ColumnType,
		data,
		content,
		color = false,
		className = '',
		noborder = false
	}: Props = $props();

	let rows = $derived(
		content
			.split(',')
			.map((r) => r.split(':').map((r) => parseFloat(r)))
			.sort((a, b) => a[1] - b[1])
	);
</script>

<table class={className}>
	<tbody>
		{#each rows as row}
			<tr>
				<th
					class:noborder
					class={'label' +
						(color && row[1] >= 1 ? ' increase' : color && row[1] < 0 ? ' decrease' : '')}
					>{row[1]}</th
				>
				<td class:noborder><ColumnType {...data} id={row[0]} small={true} /></td>
			</tr>
		{/each}
	</tbody>
</table>

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
</style>
