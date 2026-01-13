<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { Snippet } from 'svelte';

	interface Props {
		tabNames: string[];
		children: Snippet<[number]>;
	}

	let { tabNames, children }: Props = $props();

	const activeTab = $derived.by(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const tabParam = urlParams.get('tab');
		if (tabParam && !isNaN(parseInt(tabParam))) {
			return tabParam;
		}
		return '1';
	});

	function handleTabChange(newIndex: string) {
		goto(`?tab=${newIndex}`, { replaceState: true });
	}
</script>

<Tabs.Root value={activeTab} onValueChange={handleTabChange}>
	<Tabs.List>
		{#each tabNames as name, i}
			<Tabs.Trigger value={(i + 1).toString()}>{name}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each tabNames as _, i}
		<Tabs.Content value={(i + 1).toString()} class="mt-4">
			{@render children(i + 1)}
		</Tabs.Content>
	{/each}
</Tabs.Root>
