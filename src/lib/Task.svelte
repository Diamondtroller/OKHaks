<script lang="ts">
	import { quests, questsp } from '$lib/quests';
	import { stringsLV, stringsLVp } from '$lib/stringsLV';
	export let id: number;
	export let small = false;

	let icon = 'quest_icons/misteryTask';
	$: questsp.then(() => {
		icon = 'quest_icons/' + ($quests.tasks[id]?.icon ?? 'misteryTask');
	});
	let name = 'Ielādē...';
	$: stringsLVp.then(() => {
		name = $stringsLV.TASKS[id]?.NAME ?? 'Nav atrasts';
	});
</script>

<a href="/quests/tasks/?id={id}" data-sveltekit-preload-data="false">
	<table>
		<tr>
			<td><img src="https://okeanija.draugiem.lv/html5/i/{icon}.png" alt={name} class:small /></td>
			<td>{name} (#{id})</td>
		</tr>
	</table>
</a>

<style>
	.small {
		height: 1.3rem;
	}
	td {
		border: unset;
	}
</style>
