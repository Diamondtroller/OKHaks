<script lang="ts">
	export let ColumnType;
	export let content: string;
	export let color = false;
	export let className = '';
	export let noborder = false;

	$: rows = content
		.split(',')
		.map((r) => r.split(':').map((r) => parseFloat(r)))
		.sort((a, b) => a[1] - b[1]);
</script>

<table class={className}>
	{#each rows as row}
		<tr>
			<th
				class:noborder
				class={'label' +
					(color && row[1] >= 1 ? ' increase' : color && row[1] < 0 ? ' decrease' : '')}
				>{row[1]}</th
			>
			<td class:noborder><svelte:component this={ColumnType} id={row[0]} small={true} /></td>
		</tr>
	{/each}
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
	}
</style>
