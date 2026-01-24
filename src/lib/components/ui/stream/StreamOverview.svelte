<script lang="ts">
	import type { Stream, StreamMessage, StreamMessageContent } from '$lib/models/entity';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import CodeBlock from '$lib/components/ui/text/CodeBlock.svelte';
	import { formatEpoch, formatBytes } from '$lib/utils';
	import { CoroClient } from '$lib/coro-client';
	import { showError, showInfo } from '$lib/stores/toast';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import PlayCircle from '@lucide/svelte/icons/play-circle';
	import StopCircle from '@lucide/svelte/icons/stop-circle';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Eye from '@lucide/svelte/icons/eye';
	import Circle from '@lucide/svelte/icons/circle';
	import { onMount, onDestroy } from 'svelte';
	import { API_BASE_URL } from '$lib/config/api-base-url';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

	interface Props {
		accountId: string;
		streamName: string;
	}

	let { accountId, streamName }: Props = $props();

	const client = new CoroClient();

	let loading = $state(true);
	let stream = $state<Stream | undefined>(undefined);
	let messages = $state<StreamMessage[]>([]);
	let loadingMessages = $state(false);
	let selectedMessage = $state<StreamMessageContent | undefined>(undefined);
	let loadingMessageContent = $state(false);
	let isLiveConsuming = $state(false);
	let ws = $state<WebSocket | undefined>(undefined);
	let autoScroll = $state(false);
	let showScrollButton = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state(undefined);

	const BATCH_SIZE = 50;
	let nextSequence = $state<number | undefined>(undefined);

	onMount(async () => {
		try {
			loading = true;
			stream = await client.fetchStream(accountId, streamName);
			await loadMessages(1);
		} catch (e) {
			showError(e as Error);
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		stopLiveConsume();
	});

	async function loadMessages(startSequence: number): Promise<number> {
		try {
			loadingMessages = true;
			const batch = await client.fetchStreamMessages(
				accountId,
				streamName,
				startSequence,
				BATCH_SIZE
			);

			// Ensure batch is an array
			const batchArray = Array.isArray(batch) ? batch : [];

			// Filter out duplicates by checking existing message sequences
			const existingSequences = new Set(messages.map((m) => m.stream_sequence));
			const newMessages = batchArray.filter((msg) => !existingSequences.has(msg.stream_sequence));

			if (newMessages.length > 0) {
				messages = [...messages, ...newMessages];
			}

			if (batchArray.length === BATCH_SIZE && batchArray[batchArray.length - 1]?.stream_sequence) {
				nextSequence = parseInt(batchArray[batchArray.length - 1].stream_sequence) + 1;
			} else {
				nextSequence = undefined;
			}

			return newMessages.length;
		} catch (e) {
			showError(e as Error);
			return 0;
		} finally {
			loadingMessages = false;
		}
	}

	async function loadMore() {
		// Always use the last message's sequence + 1 if we have messages
		// This ensures we load correctly even after live consume adds messages
		const startSeq =
			messages.length > 0
				? parseInt(messages[messages.length - 1].stream_sequence) + 1
				: nextSequence !== undefined
					? nextSequence
					: 1;
		const newMessagesCount = await loadMessages(startSeq);
		if (newMessagesCount === 0) {
			showInfo('No new messages');
		}
	}

	async function selectMessage(msg: StreamMessage) {
		try {
			loadingMessageContent = true;
			const sequence = parseInt(msg.stream_sequence);
			selectedMessage = await client.fetchStreamMessageContent(accountId, streamName, sequence);
		} catch (e) {
			showError(e as Error);
		} finally {
			loadingMessageContent = false;
		}
	}

	function startLiveConsume() {
		if (isLiveConsuming || !namespaceStore.activeId) return;

		const lastSeq =
			messages.length > 0 ? parseInt(messages[messages.length - 1].stream_sequence) : 0;
		const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/v1/namespaces/${namespaceStore.activeId}/accounts/${accountId}/streams/${streamName}/consume/?start_sequence=${lastSeq + 1}`;

		ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			isLiveConsuming = true;
			autoScroll = true;
		};

		ws.onmessage = (event) => {
			try {
				const parsed = JSON.parse(event.data);
				const msg: StreamMessage = parsed.data.message;
				messages = [...messages, msg];
			} catch (e) {
				console.error('Failed to parse WebSocket message:', e);
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			stopLiveConsume();
		};

		ws.onclose = () => {
			isLiveConsuming = false;
		};
	}

	function stopLiveConsume() {
		if (ws) {
			ws.close(1000, 'Normal closure');
			ws = undefined;
		}
		isLiveConsuming = false;
		autoScroll = false;
	}

	function scrollToBottom() {
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
			autoScroll = true;
			showScrollButton = false;
		}
	}

	function handleScroll() {
		if (!scrollContainer) return;

		const isAtBottom =
			scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight <
			10;

		if (isAtBottom) {
			showScrollButton = false;
			if (isLiveConsuming) {
				autoScroll = true;
			}
		} else {
			autoScroll = false;
			if (isLiveConsuming || messages.length > 0) {
				showScrollButton = true;
			}
		}
	}

	// Auto-scroll when messages change and autoScroll is enabled
	$effect(() => {
		if (autoScroll && scrollContainer && messages.length > 0) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}
	});

	// Check if scroll button should be shown when messages or container changes
	$effect(() => {
		if (scrollContainer && messages.length > 0) {
			// Use setTimeout to ensure DOM has updated after message changes
			setTimeout(() => {
				if (!scrollContainer) return;
				const isAtBottom =
					scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight <
					10;
				if (!isAtBottom && !autoScroll) {
					showScrollButton = true;
				}
			}, 100);
		}
	});

	function decodedData(data: string): string {
		try {
			return atob(data);
		} catch {
			return data;
		}
	}
</script>

<div class="space-y-6">
	<!-- Stream Info -->
	<div>
		<h2 class="mb-4 text-xl font-semibold sm:text-2xl">Stream Details</h2>
		{#if loading}
			<div class="space-y-3">
				{#each { length: 4 } as _}
					<Skeleton class="h-4 w-full" />
				{/each}
			</div>
		{:else if stream}
			<div class="border rounded-lg bg-card p-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div class="space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Messages
						</div>
						<div class="text-2xl font-semibold">{stream.message_count.toLocaleString()}</div>
					</div>
					<div class="space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Consumers
						</div>
						<div class="text-2xl font-semibold">{stream.consumer_count}</div>
					</div>
					<div class="space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Created
						</div>
						<div class="text-base font-medium">
							{new Date(stream.create_time * 1000).toLocaleString()}
						</div>
					</div>
				</div>
				{#if stream.subjects && stream.subjects.length > 0}
					<div class="mt-6 pt-6 border-t space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Subjects
						</div>
						<div class="text-sm font-medium font-mono">{stream.subjects.join(', ')}</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Messages -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold sm:text-2xl">Messages</h2>
			<div class="flex gap-2 items-center">
				{#if isLiveConsuming}
					<Circle class="size-2.5 fill-primary text-primary animate-pulse" />
				{/if}
				{#if !isLiveConsuming}
					<Button variant="outline" onclick={startLiveConsume} size="sm">
						<PlayCircle class="size-4" />
						Watch Live
					</Button>
				{:else}
					<Button
						variant="outline"
						onclick={stopLiveConsume}
						size="sm"
						class="border-primary bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
					>
						<StopCircle class="size-4" />
						Stop
					</Button>
				{/if}
			</div>
		</div>

		<div class="overflow-x-auto relative">
			<div
				bind:this={scrollContainer}
				onscroll={handleScroll}
				class="max-h-96 overflow-y-auto border rounded-lg"
			>
				<Table.Root>
					<Table.Header class="sticky top-0 bg-background z-10 border-b">
						<Table.Row class="hover:bg-transparent">
							<Table.Head class="font-semibold w-24">Sequence</Table.Head>
							<Table.Head class="font-semibold">Subject</Table.Head>
							<Table.Head class="font-semibold">Preview</Table.Head>
							<Table.Head class="font-semibold w-20">Size</Table.Head>
							<Table.Head class="font-semibold w-40">Timestamp</Table.Head>
							<Table.Head class="font-semibold w-12"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if loadingMessages && messages.length === 0}
							<Table.Row>
								{#each { length: 6 } as _}
									<Table.Cell>
										<Skeleton class="h-4 w-24" />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else if messages.length === 0}
							<Table.Row>
								<Table.Cell colspan={6}>
									<div class="text-muted-foreground my-20 text-center">
										<p>No messages in stream</p>
									</div>
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each messages as msg, i (i)}
								{#if msg && msg.stream_sequence}
									<Table.Row
										class="group hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0 {i %
										2 ===
										0
											? 'bg-muted/20'
											: ''}"
										onclick={() => selectMessage(msg)}
									>
										<Table.Cell class="font-mono">{msg.stream_sequence}</Table.Cell>
										<Table.Cell>{msg.subject}</Table.Cell>
										<Table.Cell class="text-muted-foreground">{msg.preview}</Table.Cell>
										<Table.Cell class="font-mono text-sm"
											>{formatBytes(msg.size_bytes)}</Table.Cell
										>
										<Table.Cell class="text-right text-muted-foreground"
											>{formatEpoch(msg.timestamp)}</Table.Cell
										>
										<Table.Cell class="text-center w-12">
											<Eye
												class="size-4 text-muted-foreground group-hover:text-foreground inline-block transition-colors"
											/>
										</Table.Cell>
									</Table.Row>
								{/if}
							{/each}
						{/if}
						{#if messages.length > 0 && !isLiveConsuming}
							<Table.Row class="hover:bg-transparent border-0">
								<Table.Cell colspan={6} class="pt-4 pb-3 bg-background">
									<div class="flex justify-center">
										<Button variant="outline" onclick={loadMore} disabled={loadingMessages}>
											{#if loadingMessages}
												<LoaderCircle class="size-4 animate-spin" />
											{:else}
												<RefreshCw class="size-4" />
												Load More
											{/if}
										</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</div>

			<!-- Scroll to bottom button -->
			{#if showScrollButton}
				<button
					onclick={scrollToBottom}
					class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full bg-primary p-2.5 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
					aria-label={isLiveConsuming ? 'Resume auto-scroll' : 'Scroll to bottom'}
				>
					<ArrowDown class="size-4" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Selected Message Content -->
	{#if selectedMessage}
		<div>
			<h2 class="mb-4 text-xl font-semibold sm:text-2xl">Message Content</h2>
			<div class="border rounded-lg bg-card p-4 mb-4">
				<div class="flex gap-8 text-sm">
					<div class="space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Sequence
						</div>
						<div class="font-mono font-medium">{selectedMessage.stream_sequence}</div>
					</div>
					<div class="space-y-1">
						<div class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Timestamp
						</div>
						<div class="font-medium">{formatEpoch(selectedMessage.timestamp)}</div>
					</div>
				</div>
			</div>
			<CodeBlock loading={loadingMessageContent} content={decodedData(selectedMessage.data)} wrap />
		</div>
	{/if}
</div>
