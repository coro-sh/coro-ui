<script lang="ts">
	import { StreamConsumerWebSocketClient } from '$lib/stream-client';
	import { onDestroy, onMount } from 'svelte';
	import { showErrorToast } from '$lib/stores/toast';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type { ConsumerMessageResponse } from '$lib/models/entity';

	export let accountId: string;
	export let streamName: string;

	let loading = true;
	let loadFailed = false;
	let messages: ConsumerMessageResponse[] = [];

	const columns = ['Data'];

	const streamClient = new StreamConsumerWebSocketClient(accountId, streamName, onStreamConsumerMessage, onStreamConsumerError);

	onMount(async () => {
		try {

		} catch (e) {
			showErrorToast(e);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});

	streamClient.connect();

	// cleanup consumer websocket browser/tab closer
	window.addEventListener('beforeunload', handleBeforeUnload);

	function handleBeforeUnload() {
		streamClient?.disconnect();
	}

	// cleanup consumer websocket when component is destroyed
	onDestroy(() => {
		if (streamClient) {
			streamClient.disconnect();
		}
	});


	function onStreamConsumerMessage(msg: ConsumerMessageResponse) {
		messages = [...messages, msg];
	}

	function onStreamConsumerError(error: any) {
		// TODO:
		console.error(error);
	}
</script>

<div class="overflow-x-auto max-h-[580px] overflow-y-auto">
	<Table noborder={true} color="custom" class="table-auto w-full dark:bg-none">
		<TableHead class="sticky top-0 bg-mono-200 dark:bg-mono-700">
			{#each columns as title}
				<TableHeadCell class="p-4 font-medium whitespace-nowrap w-1/12">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#if !messages.length}
				<TableBodyRow>
					<TableBodyCell colspan={columns.length}>
						<div class="text-base text-center items-center text-mono-500 my-56">
							<p>No messages</p>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{:else}
				{#each messages as msg, i}
					<TableBodyRow class={i < messages.length - 1 ? 'border-b border-light-border dark:border-dark-border' : ''}>
						<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
							{atob(msg.data)}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>
