<script module lang="ts">
	import { m } from './paraglide/messages';

	export {simpleEntry}

	export const toYesNo = (field: any) => field === '1' ? m.yes() : m.no();
</script>

{#snippet simpleEntry(field: any, label: string, callback = undefined as any)}
	{#if field}
		<tr>
			<th>{label}</th>
			<td>{callback ? callback(field) : field}</td>
		</tr>
	{/if}
{/snippet}

<style>
	td {
		text-align: center;
	}
	th {
		text-align: left;
	}
</style>
