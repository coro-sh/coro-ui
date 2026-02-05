<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { showError } from '$lib/stores/toast';
	import { CoroClient, type Paginator } from '$lib/coro-client';
	import { formatDurationCompact } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { OperatorResponse } from '$lib/models/entity';

	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Home from '@lucide/svelte/icons/home';
	import Circle from '@lucide/svelte/icons/circle';
	import Server from '@lucide/svelte/icons/server';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	import CreateOperatorModal from '$lib/components/ui/operator/CreateOperatorModal.svelte';

	let loading = $state(true);
	let loadFailed = $state(false);
	let openCreateOperatorModal = $state(false);
	let operators = $state<OperatorResponse[]>([]);
	let hasMore = $state(false);

	const columns = 3;
	const defaultPageSize = 60;

	const client = new CoroClient();
	let paginator: Paginator<OperatorResponse>;

	// Get namespace ID from URL params
	const namespaceId = $derived(page.params.namespace);

	onMount(async () => {
		// Ensure namespace is set in store
		if (namespaceId) {
			namespaceStore.setActiveId(namespaceId);
		}

		// Create paginator after namespace is available
		paginator = client.paginateOperators(defaultPageSize);

		try {
			await fetchNextPage();
		} catch {
			loadFailed = true;
		}
	});

	// Adjust page size to fill grid evenly
	$effect(() => {
		if (operators.length > 0) {
			const remainder = operators.length % columns;
			if (remainder > 0) {
				paginator.size = defaultPageSize + columns - remainder;
			}
		}
	});

	async function fetchNextPage() {
		loading = true;
		try {
			const page = await paginator.fetchNext();
			operators = [...operators, ...page];
			hasMore = paginator.hasNext();
		} catch (e) {
			showError(e as Error);
		} finally {
			loading = false;
		}
	}

	function handleCreateOperator() {
		openCreateOperatorModal = true;
	}
</script>

<svelte:head>
	<title>Operators - Coro</title>
</svelte:head>

<main>
	{#if loadFailed}
		<ErrorLoadResourceSection />
	{:else}
		<Breadcrumb.Root class="mb-5">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href={`/namespaces/${namespaceId}/operators`} class="flex items-center gap-2">
						<Home class="size-4" />
						Operators
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-5 flex items-center justify-between">
			<h1 class="text-foreground text-3xl font-bold">Operators</h1>
			<Button onclick={handleCreateOperator}>
				<Plus class="size-4" />
				Create Operator
			</Button>
		</div>

		<div class="mt-px space-y-4">
			{#if !loading && !operators.length}
				<!-- Empty state -->
				<div class="flex h-96 items-center justify-center">
					<Card.Root class="w-full max-w-2xl">
						<Card.Content class="pt-6">
							<div class="mb-3 flex items-center justify-center">
								<FolderOpen class="text-muted-foreground size-12" />
							</div>
							<div class="text-muted-foreground text-center">
								<p class="text-foreground mb-2 text-2xl font-medium">No Operators found</p>
								<p class="mb-5 text-base">Get started by creating a new Operator</p>
								<Button variant="outline" onclick={handleCreateOperator}>
									<Plus class="size-4" />
									Create Operator
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			{:else if loading && !operators.length}
				<!-- Loading skeleton -->
				<div class="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{#each { length: 3 } as _}
						<Card.Root>
							<Card.Content class="pt-6">
								<!-- Icon and Title Row -->
								<div class="flex items-start gap-4">
									<Skeleton class="size-12 flex-shrink-0 rounded-lg" />
									<Skeleton class="h-7 flex-1" />
								</div>

								<!-- Status skeleton -->
								<div class="mt-4 flex items-center gap-2 pt-2">
									<Skeleton class="h-6 w-32" />
									<Skeleton class="h-4 w-24" />
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<!-- Operators grid -->
				<div class="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{#each operators as operator (operator.id)}
						<a
							href={`/namespaces/${namespaceStore.activeId}/operators/${operator.id}`}
							class="group block"
						>
							<Card.Root class="hover:bg-accent/50 relative transition-colors">
								<Card.Content	>
									<!-- Icon, Title, and Chevron Row -->
									<div class="mb-6 flex items-center gap-4">
										<div
											class="flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors bg-primary/10 text-primary group-hover:bg-primary/15"
										>
											<Server class="size-6" />
										</div>
										<h3 class="text-foreground flex-1 truncate text-2xl font-semibold">
											{operator.name}
										</h3>
										<ChevronRight
											class="text-primary size-7 shrink-0 transition-transform group-hover:translate-x-1"
										/>
									</div>

									<!-- Status section with darker background -->
									<div class="{operator.status.connected ? 'bg-primary/5 border-primary/20' : 'bg-muted/40'} border-[0.5px] rounded-2xl p-2">
										<div class="flex items-center gap-3">
											<Badge
												variant={operator.status.connected ? 'success' : 'neutral'}
												class="flex items-center gap-1.5"
											>
												<Circle class="size-1.5! fill-current" />
												{operator.status.connected ? 'Connected' : 'Disconnected'}
											</Badge>
											{#if operator.status.connected && operator.status.connect_time}
												<span class="text-emerald-800 dark:text-emerald-500/80 text-sm">
													Online for {formatDurationCompact(Math.floor(Date.now() / 1000) - operator.status.connect_time)}
												</span>
											{:else if operator.last_connect_time}
												<span class="text-muted-foreground text-sm">
													Last online {formatDurationCompact(Math.floor(Date.now() / 1000) - operator.last_connect_time)} ago
												</span>
											{:else}
												<span class="text-muted-foreground text-sm">
													No history
												</span>
											{/if}
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</a>
					{/each}
				</div>

				{#if hasMore}
					<div class="col-span-3 flex justify-center">
						<Button variant="outline" size="sm" onclick={fetchNextPage} disabled={loading}>
							{#if loading}
								<LoaderCircle class="size-4 animate-spin" />
							{:else}
								Load More
							{/if}
						</Button>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</main>

<CreateOperatorModal bind:operators bind:open={openCreateOperatorModal} />
