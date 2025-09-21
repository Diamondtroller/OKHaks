<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/images/OKHaks.png';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref, deLocalizeHref } from '$lib/paraglide/runtime';
</script>

<header>
	<a class="corner" href="https://github.com/Diamondtroller/OKHaks"
		><img src={logo} alt="OKHaks" /></a
	>
	<nav>
		<ul>
			{#each [{ path: '/', label: m['header.main']() }, { path: '/items/', label: m['header.items']() }, { path: '/quests/', label: m['header.quests']() }, { path: '/quests/tasks/', label: m['header.tasks']() }] as link}
				<li aria-current={deLocalizeHref(page.url.pathname) === link.path ? 'page' : null}>
					<a href={localizeHref(link.path)}>{link.label}</a>
				</li>
			{/each}
			{#if true}
			{@const link = page.url.pathname.startsWith('/en') ? { path: localizeHref(deLocalizeHref(page.url.href), { locale: 'lv'}), label: 'Latviski' } : { path: localizeHref(deLocalizeHref(page.url.href), { locale: 'en'}), label: 'English'}}
			<li>
				<a data-sveltekit-reload href={link.path}>{link.label}</a>
			</li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		position: absolute;
		width: calc(100% - 2 * var(--bor-thick));
		display: flex;
		justify-content: space-around;
		z-index: 1;
		--background: #d9c969;
		background-color: var(--background);
		border: solid var(--bor-thick);
	}

	.corner {
		height: 4rem;
	}

	.corner img {
		height: inherit;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 2.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
		background-color: var(--inner-color);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
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

	li[aria-current='page'] {
		border-bottom: solid var(--bor-thick);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		text-transform: uppercase;
		text-decoration: none;
	}
</style>
