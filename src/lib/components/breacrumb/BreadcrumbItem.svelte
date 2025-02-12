<script lang="ts">

	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';

	export let loading = false;
	export let href: string = '#';
</script>

<li class="flex items-center">
	<div class="flex items-center">
		<svg class="rtl:rotate-180 w-3 h-3 text-mono-700 dark:text-mono-400 mx-2" aria-hidden="true"
				 xmlns="http://www.w3.org/2000/svg"
				 fill="none" viewBox="0 0 6 10">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
		</svg>
		{#if loading}
			<div class="min-w-20">
				<PlaceholderLine />
			</div>
		{:else }
			<a href={href}
				 class="ms-1 text-sm font-medium text-mono-700 hover:text-light-base md:ms-2 dark:text-mono-400 dark:hover:text-dark-base">
				<slot />
			</a>
		{/if}
	</div>
</li>
