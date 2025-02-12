<script lang="ts">
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import More from '$lib/components/nav/More.svelte';
	import { goto } from '$app/navigation';
	import { twMerge } from 'tailwind-merge';

	export let href: string;
	export let bottomBorder = true;

	function navigate() {
		goto(href);
	}
</script>

<TableBodyRow
	class={twMerge(
		'cursor-pointer hover:bg-light-contentHover dark:hover:bg-dark-contentHover',
		bottomBorder ? 'border-b border-light-border dark:border-dark-border' : ''
	)}
	on:click={navigate}
>
	<slot />
	<TableBodyCell class="p-4 text-right">
		<More />
	</TableBodyCell>
</TableBodyRow>
