<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import More from '$lib/components/ui/nav/More.svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		bottomBorder?: boolean;
		children: Snippet;
	}

	let { href, bottomBorder = true, children }: Props = $props();

	function navigate() {
		goto(href);
	}
</script>

<Table.Row
	class={cn(
		'hover:bg-accent/50 cursor-pointer transition-colors',
		bottomBorder ? 'border-border border-b' : ''
	)}
	onclick={navigate}
>
	{@render children()}
	<Table.Cell class="text-right">
		<More />
	</Table.Cell>
</Table.Row>
