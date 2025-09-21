<script lang="ts">
	import LoadingSVG from './Loading.svg.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<div class="tcenter">
	<p>{m['loading']()}</p>
	<div class="tcenter rot" style:width="5vw">
		<LoadingSVG />
	</div>
</div>

<style>
	div .rot {
		width: 8vw;
		margin: auto;
		animation: spin 2s linear 0s infinite none;
	}
	@keyframes spin {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(1turn);
		}
	}
</style>
