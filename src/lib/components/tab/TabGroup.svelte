<script lang="ts">
	import { goto } from '$app/navigation';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let tabNames: string[]; // max of 5
	const tabCount = tabNames.length;
	export let slotsNoContentWrapper: number[] = [];

	let noContentWrapper = false;
	let activeTab = 1;

	$: noContentWrapper = slotsNoContentWrapper.includes(activeTab);

	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const tabParam = urlParams.get('tab');
		if (tabParam && !isNaN(parseInt(tabParam))) {
			activeTab = parseInt(tabParam);
		}
	}

	// Updates url when the active tab changes
	function handleTabChange(newIndex: number) {
		activeTab = newIndex;
		goto(`?tab=${newIndex}`, { replaceState: true });
	}

</script>
<Tabs tabStyle="underline"
			contentClass={noContentWrapper ? '' : 'p-4 bg-white dark:bg-dark-content border border-light-border dark:border-dark-border shadow-sm rounded-lg mt-4'}
>
	<hr slot="divider" class="border-t border-light-border dark:border-dark-border mb-4" />
	{#if tabCount >= 1}
		<TabItem open={activeTab === 1} on:click={() => {handleTabChange(1)}}>
			<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{tabNames[0]}</p>
			<slot name="1" />
		</TabItem>
	{/if}
	{#if tabCount >= 2}
		<TabItem open={activeTab === 2} on:click={() => {handleTabChange(2)}}>
			<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{tabNames[1]}</p>
			<slot name="2" />
		</TabItem>
	{/if}
	{#if tabCount >= 3}
		<TabItem open={activeTab === 3} on:click={() => {handleTabChange(3)}}>
			<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{tabNames[2]}</p>
			<slot name="3" />
		</TabItem>
	{/if}
	{#if tabCount >= 4}
		<TabItem open={activeTab === 4} on:click={() => {handleTabChange(4)}}>
			<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{tabNames[3]}</p>
			<slot name="4" />
		</TabItem>
	{/if}
	{#if tabCount >= 5}
		<TabItem open={activeTab === 5} on:click={() => {handleTabChange(5)}}>
			<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{tabNames[4]}</p>
			<slot name="5" />
		</TabItem>
	{/if}
</Tabs>
