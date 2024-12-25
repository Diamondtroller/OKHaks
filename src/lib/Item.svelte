<script lang="ts">
	import { items, itemsp } from '$lib/items';
	import { stringsLV, stringsLVp } from '$lib/stringsLV';
	export let id: number | string;
	let imageElement: HTMLImageElement;
	let divElement: HTMLDivElement;
	let imageWidth: number, imageHeight: number;
	let frames: any;
	let options: any;
	let loop = false;

	if (typeof id === 'string') {
		id = parseInt(id);
		if (Number.isNaN(id)) id = -1;
	}
	export let small = false;

	let icon = 'quest_icons/misteryTask';
	$: itemsp.then(() => {
		icon = $items.items[id]?.itemClass
			? 'map_objects/' + $items.items[id].itemClass
			: $items.items[id]?.iconClass
				? 'item_icons/' + $items.items[id].iconClass
				: 'quest_icons/misteryTask';
	});
	let name = 'Ielādē...';
	$: stringsLVp.then(() => {
		name = $stringsLV.ITEMS[id]?.CAPTION ?? 'Nav atrasts';
	});

	function loadImage(id: number) {
		function animationCleanup() {
			loop = false;
			imageElement.getAnimations().forEach((an) => {
				an.cancel();
			});
		}

		if (!$items.items[id]) return animationCleanup();
		let spriteInfo = {} as {
			width?: number;
			height?: number;
			type?: string;
			animated?: boolean;
			frames: number;
			framePositions?: [number, number][];
			fps: number;
			flash: boolean;
		};

		if ($items.items[id].animation) {
			spriteInfo = Object.fromEntries(
				$items.items[id].animation!.split(',').map((r) => r.split(':'))
			);
			spriteInfo.animated = true;
		}
		spriteInfo.flash = $items.items[id].ba ? $items.items[id].ba === '1' : false;
		if ($items.items[id].b) {
			const b = $items.items[id].b.split(',').map((x) => parseInt(x)); // [0] [1] are floats but we don't care about them
			if (b.length > 2) {
				spriteInfo.width = b[2];
				spriteInfo.height = b[3];
				spriteInfo.frames = b[4];
				spriteInfo.animated = b[5] === 1;
			}
		}

		//Animate everything for now, because it's pretty
		if (!spriteInfo.animated && !spriteInfo.flash && spriteInfo.frames > 1) {
			spriteInfo.animated = true;
			spriteInfo.fps = 0.5;
		}

		spriteInfo.framePositions = new Array(spriteInfo.frames);
		if ($items.items[id].bfs) {
			for (const e of $items.items[id].bfs.split(';').map((r) => r.split(','))) {
				for (const index of e.slice(2)) {
					spriteInfo.framePositions[parseFloat(index)] = [
						parseFloat(e[0]) / imageWidth,
						parseFloat(e[1]) / imageHeight
					];
				}
			}
		} else {
			const rows = imageHeight / spriteInfo.height!;
			const cols = imageWidth / spriteInfo.width!;
			stop: for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const idx = col + cols * row;
					spriteInfo.framePositions[idx] = [col / cols, row / rows];
					if (idx >= spriteInfo.frames - 1) break stop;
				}
			}
		}
		spriteInfo.fps ??= 24;
		if (spriteInfo.flash) {
			// not loading zips for now, because of CORS errors
			spriteInfo.animated = false;
			delete spriteInfo.height;
			delete spriteInfo.width;
		}
		spriteInfo.animated &&= !spriteInfo.flash; // Above was getting spriteInfo

		// Now apply spriteInfo to the element
		imageElement.width = imageWidth;
		imageElement.height = imageHeight;

		divElement.style.width = `${spriteInfo.width ?? imageWidth}px`;
		divElement.style.height = `${spriteInfo.height ?? imageHeight}px`;

		if (small) {
			imageElement.style.height = '2rem';
			const clientHeight = imageElement.clientHeight;
			const aspectRatio = (spriteInfo.width ?? imageWidth) / (spriteInfo.height ?? imageHeight);
			imageElement.style.height = '';
			imageElement.style.objectFit = 'contain';

			divElement.style.width = `${clientHeight * aspectRatio}px`;
			divElement.style.height = `${clientHeight}px`;

			imageElement.style.height = `${clientHeight * (imageHeight / (spriteInfo.height ?? imageHeight))}px`;
			imageElement.style.width = `${clientHeight * aspectRatio * (imageWidth / (spriteInfo.width ?? imageWidth))}px`;
		}

		if (spriteInfo.animated) {
			options = {
				duration: (spriteInfo.frames / spriteInfo.fps) * 1000,
				iterations: spriteInfo.type === 'rand' ? 1 : Infinity,
				easing: `steps(${spriteInfo.frames}, jump-none)`
			};
			frames = [];
			for (const frame of spriteInfo.framePositions) {
				frames.push({
					transform: `translate(-${frame[0] * 100}%,-${frame[1] * 100}%)`
				});
			}
			if (spriteInfo.type === 'rand') {
				startAnimation();
			} else {
				imageElement.animate(frames, options);
			}
		} else {
			animationCleanup(); // cleanup animations from previous elements
		}
		async function startAnimation() {
			loop = true;
			while (loop) {
				const a = imageElement.animate(frames, options);
				a.oncancel = () => {
					loop = false;
				};
				await a.finished;
				await new Promise((res) => setTimeout(res, (Math.random() * 4 + 3) * 1000));
			}
		}
	}
</script>

<a href="/items/?id={id}" data-sveltekit-preload-data="false">
	<table>
		<tr>
			<td>
				{#await itemsp}
					<img src="https://okeanija.draugiem.lv/html5/i/{icon}.png?v=4" alt={name} />
				{:then}
					<div bind:this={divElement}>
						<img
							src="https://okeanija.draugiem.lv/html5/i/{icon}.png?v=4"
							alt={name}
							bind:naturalWidth={imageWidth}
							bind:naturalHeight={imageHeight}
							bind:this={imageElement}
							on:load={() => loadImage(id)}
						/>
					</div>
				{/await}
			</td>
			<td>{name} (#{id})</td>
		</tr>
	</table>
</a>

<style>
	div {
		overflow: clip;
	}
	table {
		border: unset;
	}
	img {
		overflow: clip;
		object-fit: none;
		object-position: left top;
	}
	td {
		border: unset;
	}
</style>
