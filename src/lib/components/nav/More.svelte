<script lang="ts">
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import { twMerge } from 'tailwind-merge';

	export let href: string | undefined = undefined;

	export let hover: boolean = false;

	$: aClass = twMerge(
		'inline-flex items-center text-xs font-medium text-primary-700 sm:text-base dark:text-primary-500 p-2',
		hover ? 'rounded-lg hover:bg-mono-100 dark:hover:bg-mono-700 uppercase' : ''
	);
</script>

<div class={aClass}>
	{#if href}
		<a {href}>
			<ChevronRightOutline size="md" />
		</a>
	{:else }
		<ChevronRightOutline size="md" />
	{/if}
</div>
