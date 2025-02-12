<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let maxHeightClass:string

	let scrollableEl: HTMLDivElement;
	let scrollbarVisible = false;
	let resizeObserver: ResizeObserver;

	function checkScrollbar() {
		if (!scrollableEl) return;
		scrollbarVisible = scrollableEl.scrollHeight > scrollableEl.clientHeight;
	}

	onMount(() => {
		checkScrollbar();
		resizeObserver = new ResizeObserver(() => {
			checkScrollbar();
		});
		resizeObserver.observe(scrollableEl);
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
	});
</script>

<div
	bind:this={scrollableEl}
	class={`overflow-y-auto ${scrollbarVisible ? 'pr-2' : ''} ${maxHeightClass}`}
>
	<slot />
</div>
