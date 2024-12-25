<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/OKHaks.png';
</script>

<header>
  <div class="corner"><img src={logo} alt="OKHaks" ></div>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
        <a href="/">Sākums</a>
			</li>
			<li aria-current={$page.url.pathname === '/items/' ? 'page' : undefined}>
				<a href="/items/">Lietas</a>
			</li>
			<li aria-current={$page.url.pathname === '/quests/' ? 'page' : undefined}>
				<a href="/quests/">Mērķi</a>
			</li>
			<li aria-current={$page.url.pathname === '/quests/tasks/' ? 'page' : undefined}>
				<a href="/quests/tasks/">Uzdevumi</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-around;
	}

	.corner {
		height: 5rem;
	}

	.corner img {
		height: inherit;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: space-around;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		text-transform: uppercase;
		text-decoration: none;
	}
</style>
