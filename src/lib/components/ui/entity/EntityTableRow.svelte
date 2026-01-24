<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import More from '$lib/components/ui/nav/More.svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		bottomBorder?: boolean;
		children: Snippet;
		disabled?: boolean;
	}

	let { href, bottomBorder = true, children, disabled = false }: Props = $props();

	function navigate() {
		if (href && !disabled) {
			goto(href);
		}
	}
</script>

<Table.Row
	class={cn(
		disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent/50 cursor-pointer',
		'transition-colors',
		bottomBorder ? 'border-border border-b' : ''
	)}
	onclick={navigate}
>
	{@render children()}
	<Table.Cell class="text-right">
		{#if !disabled}
			<More />
		{/if}
	</Table.Cell>
</Table.Row>
