<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m['main.heading']()}</title>
	<meta name="description" content={m['main.heading']()} />
</svelte:head>

<div>
	<h1>{m['main.heading']()}</h1>
	<h2>{m['main.description']()}</h2>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex: 0.8;
	}
</style>
