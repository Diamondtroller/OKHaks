<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/OKHaks.png';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';

	let finderToggled = $state(false);
</script>

<header>
	<a class="corner" href="https://github.com/Diamondtroller/OKHaks"
		><img src={logo} alt="OKHaks" /></a
	>
	<nav>
		<menu>
			{#snippet anchor(link: string, label: string)}
				<li aria-current={deLocalizeHref(page.url.pathname) === link ? 'page' : null}>
					<a href={localizeHref(link)} onclick={() => (finderToggled = false)}>{label}</a>
				</li>
			{/snippet}
			{@render anchor('/', m['header.main']())}
			<li>
				<button onclick={() => (finderToggled = !finderToggled)}>{m['header.finders']()}</button>
				{#if finderToggled}
					<menu class="vertical">
						{@render anchor('/items/', m['items.items']())}
						{@render anchor('/quests/', m['quests.quests']())}
						{@render anchor('/quests/tasks/', m['tasks.tasks']())}
						{@render anchor('/crafting/', m['crafting.crafting']())}
					</menu>
				{/if}
				<!-- <ul> -->
				<!-- </ul> -->
			</li>
			{#if true}
				{@const link = page.url.pathname.startsWith('/en')
					? {
							path: localizeHref(deLocalizeHref(page.url.href), { locale: 'lv' }),
							label: 'Latviski'
						}
					: {
							path: localizeHref(deLocalizeHref(page.url.href), { locale: 'en' }),
							label: 'English'
						}}
				<li>
					<a data-sveltekit-reload href={link.path}>{link.label}</a>
				</li>
			{/if}
		</menu>
	</nav>
</header>

<style>
	header {
		position: absolute;
		width: calc(100% - 2 * var(--bor-thick));
		display: flex;
		justify-content: space-evenly;
		z-index: 1;
		--background: #d9c969;
		background-color: var(--background);
		border: solid var(--bor-thick);
	}

	.corner {
		height: 4rem;

		img {
			height: inherit;
			object-fit: contain;
		}
	}

	nav {
		display: flex;
		align-items: center;

		button {
			width: 7rem;
			height: 100%;
			padding: 0 0.5rem;
			text-transform: uppercase;
			background-color: unset;
			border: none;
		}
		a {
			display: flex;
			height: 100%;
			align-items: center;
			padding: 0 0.5rem;
			text-transform: uppercase;
			text-decoration: none;
		}
	}

	menu {
		position: relative;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		list-style: none;
		background-color: var(--inner-color);
		background-size: contain;
		.vertical {
			height: auto;
			flex-direction: column;
		}
	}

	li {
		position: relative;
		/* background-color: var(--inner-color); */
		height: 2.5rem;
	}

	li[aria-current='page'] {
		border-bottom: solid var(--bor-thick);
		::before {
			--size: 0.5rem;
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: calc(100% - 2 * var(--size));
			left: calc(50% - var(--size));
			border: var(--size) solid transparent;
			border-bottom: var(--size) solid var(--color-theme-1);
		}
	}
</style>
