<script lang="ts">
	import type { Items } from '$lib/items';
	import type { Strings } from '$lib/strings';
	import { onDestroy } from 'svelte';
	import { localizeHref } from './paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		items: Items;
		strings: Strings;
		id: number;
		competition?: boolean;
		small?: boolean;
		fixed?: boolean;
	}

	let { items, strings, id, competition = false, small = false, fixed = false }: Props = $props();

	const item = $derived(items.items[id]);

	const icon = $derived(
		item?.itemClass
			? 'map_objects/' + item.itemClass
			: item?.iconClass && item.iconClass !== ' '
				? 'item_icons/' + item.iconClass
				: 'quest_icons/misteryTaskB'
	);
	const name = $derived(strings.ITEMS[id]?.CAPTION ?? m['notFound']());

	let divEl: HTMLDivElement | undefined;
	let imgEl: HTMLImageElement | undefined;
	let animation: Animation | undefined = $state();
	let width: number | undefined = $state();
	let height: number | undefined = $state();

	async function startRand() {
		if (!animation) return;

		while (animation) {
			try {
				if (!animation) break;
				await animation.finished;
				if (!animation) break;
				await new Promise((resolve) => setTimeout(resolve, (4 * Math.random() + 3) * 1000));
				if (!animation) break;
				animation.play();
			} catch {
				break;
			}
		}
	}

	function animationCleanup(imgEl: HTMLImageElement | undefined) {
		imgEl?.getAnimations({ subtree: true }).forEach((an) => {
			an.cancel();
		});
		animation?.cancel();
		animation = undefined;
	}

	onDestroy(() => {
		animationCleanup(imgEl);
	});

	function redraw(clientWidth: number) {
		if (!imgEl || !divEl || width === undefined || height === undefined) {
			return;
		}
		const ratio = clientWidth / width;
		divEl.style.height = `${height * ratio}px`;
		imgEl.style.width = `${imgEl.naturalWidth * ratio}px`;
		imgEl.style.height = `${imgEl.naturalHeight * ratio}px`;
	}

	function onload() {
		if (!imgEl || !divEl) {
			return;
		}

		type SpriteConfig = {
			width?: number;
			height?: number;
			frames?: number;
			frameStack?: number[][];
			flash: boolean;
			fps?: number;
			type?: string;
			animated?: boolean;
			imageWidth: number;
			imageHeight: number;
		};
		let sConfig: SpriteConfig = {
			flash: item?.ba !== undefined,
			imageWidth: imgEl.naturalWidth,
			imageHeight: imgEl.naturalHeight
		};

		if (item?.animation && !sConfig.flash) {
			sConfig = {
				...sConfig,
				...Object.fromEntries(item.animation.split(',').map((r) => r.split(':')))
			};

			for (const key of Object.keys(sConfig) as Array<keyof SpriteConfig>) {
				if (key !== 'type') sConfig[key] = Number(sConfig[key]) as never;
			}
			sConfig.animated = true;
		}

		if (item?.b) {
			const b = item.b.split(',').map(Number);
			if (b.length > 2) {
				sConfig = {
					...sConfig,
					width: b[2],
					height: b[3],
					frames: b[4],
					animated: b[5] === 1
				};
			}
		}
		if (item?.bfs) {
			const bfs = item.bfs.split(';');
			if (bfs.length > 1) {
				sConfig.frameStack = bfs
					.map((r) => r.split(',').map(Number))
					.map((r) =>
						r.slice(2).map((q) => [r[0] / sConfig.imageWidth, r[1] / sConfig.imageHeight, q])
					)
					.flat()
					.sort((a, b) => a[2] - b[2])
					.map((r) => r.slice(0, 2));
				sConfig.frames = sConfig.frameStack.length;
			}
		}

		sConfig.width ??= sConfig.imageWidth;
		sConfig.height ??= sConfig.imageHeight;

		const rows = sConfig.imageHeight / sConfig.height;
		const cols = sConfig.imageWidth / sConfig.width;

		if (sConfig.frames && sConfig.frames > 1) {
			if (!sConfig.frameStack) {
				sConfig.frameStack = new Array(sConfig.frames);
				stop: for (let row = 0; row < rows; row++) {
					for (let col = 0; col < cols; col++) {
						const idx = col + cols * row;
						sConfig.frameStack[idx] = [col / cols, row / rows];
						if (idx >= sConfig.frames! - 1) break stop;
					}
				}
			}
			if (!sConfig.animated) {
				sConfig.animated = true;
				sConfig.fps = 0.5;
			}
		}

		width = sConfig.width;
		height = sConfig.height;

		if (small) {
			divEl.style.height = '1.5rem';
			const ratio = divEl.clientHeight / sConfig.height;
			divEl.style.width = `${sConfig.width * ratio}px`;
		} else {
			divEl.style.width = `${sConfig.width}px`;
			divEl.style.height = `${sConfig.height}px`;
		}

		sConfig.frames ??= 1;
		sConfig.fps ??= 24;

		sConfig.animated &&= !sConfig.flash;

		animationCleanup(imgEl);
		if (sConfig.animated && sConfig.frameStack) {
			sConfig.type ??= 'loop';

			let options = {
				duration: (sConfig.frames / sConfig.fps) * 1000,
				iterations: sConfig.type === 'rand' ? 1 : Infinity,
				easing: `steps(${sConfig.frames}, jump-none)`
			};
			const frames = sConfig.frameStack.map((f) => ({
				transform: `translate(-${f[0] * 100}%,-${f[1] * 100}%)`
			}));

			animation = imgEl.animate(frames, options);
			if (sConfig.type === 'rand') {
				startRand();
			}
		}
	}
</script>

<a href={localizeHref(`/items/?id=${id}${competition ? '&competition' : ''}`)} data-sveltekit-noscroll class={{ fixed }}>
	<div bind:this={divEl} bind:clientWidth={null, redraw}>
		<img
			src="https://okeanija.draugiem.lv/html5/i/{icon}.png?v=4"
			alt={name}
			bind:this={imgEl}
			{onload}
		/>
	</div>
	{name} (#{id})</a
>

<style>
	div {
		overflow: clip;
		max-width: 50%;
	}
	img {
		object-fit: cover;
		object-position: left top;
		flex-basis: content;
	}
	a {
		display: flex;
		align-items: center;
		padding: 0.1em;
		gap: 0.1em;
		&.fixed {
			width: 18em;
		}
	}
</style>
