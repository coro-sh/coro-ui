<script lang="ts">
	import { Badge, Button, Card, Heading, Indicator, Spinner } from 'flowbite-svelte';
	import { FolderOpenSolid, PlusOutline } from 'flowbite-svelte-icons';
	import CreateOperatorModal from '$lib/components/operator/CreateOperatorModal.svelte';
	import More from '$lib/components/nav/More.svelte';
	import type { OperatorResponse } from '$lib/models/entity';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import Breadcrumb from '$lib/components/breacrumb/Breadcrumb.svelte';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import { formatEpochSeconds } from '$lib/util';
	import { showErrorToast } from '$lib/stores/toast';

	let loading = true;
	let loadFailed = false;
	let openCreateOperatorModal: boolean;
	let operators: OperatorResponse[] = [];
	let hasMore = false;

	onMount(async () => {
		try {
			await fetchNextPage();
		} catch {
			loadFailed = true;
		}
	});

	const columns = 3;
	const defaultPageSize = 60;

	$: if (operators) {
		const remainder = operators.length % columns;
		if (remainder > 0) {
			paginator.size = defaultPageSize + columns - remainder;
		}
	}

	const client = new CoroClient();
	const paginator = client.paginateOperators(defaultPageSize);

	async function fetchNextPage() {
		loading = true;
		try {
			const page = await paginator.fetchNext();
			operators = [...operators, ...page];
			hasMore = paginator.hasNext();
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<main>
	{#if loadFailed}
		<ErrorLoadResourceSection />
	{:else}
		<Breadcrumb marginBot={5} />

		<div class="flex items-center justify-between mb-5">
			<span class="-mb-2.5 text-3xl font-bold leading-none text-light-base dark:text-dark-base">Operators</span>
			<Button on:click={() => { openCreateOperatorModal = true }}
							size="md"
							class="gap-2 whitespace-nowrap px-3">
				<PlusOutline size="md" />
				Create Operator
			</Button>
		</div>

		<div class="mt-px space-y-4">
			{#if !loading && !operators.length }
				<div class="flex items-center justify-center h-96">
					<Card class="w-full max-w-2xl shadow-none dark:bg-dark-content border-light-border dark:border-dark-border">
						<div class="m-5">
							<div class="flex items-center justify-center mb-3">
								<FolderOpenSolid class="text-mono-600 dark:text-mono-400 size-12" />
							</div>
							<div class="text-center text-light-alt dark:text-dark-alt">
								<p class="text-2xl font-medium mb-2">No Operators found</p>
								<p class="text-base mb-5">Get started by creating a new Operator</p>
								<Button color="alternative" on:click={() => {openCreateOperatorModal = true}}
												size="md"
												class="gap-2 whitespace-nowrap px-3">
									<PlusOutline size="md" />
									Create Operator
								</Button>
							</div>
						</div>
					</Card>
				</div>
			{:else if loading && !operators.length}
				<div class="grid grid-cols-1 gap-4 xl:grid-cols-3 mb-2">
					{#each { length: 3 } as _}
						<Card size="xl"
									class="shadow-sm max-w-none dark:bg-dark-content border-light-border dark:border-dark-border">
							<PlaceholderBlock lines={4} />
						</Card>
					{/each}
				</div>
			{:else}
				<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-2">
					{#each operators as operator}
						<a href={`/namespaces/${$activeNamespaceId}/operators/${operator.id}`} class="block">
							<Card
								size="xl"
								class="relative shadow-sm max-w-none bg-light-content hover:bg-light-contentHover dark:bg-dark-content dark:hover:bg-dark-contentHover border-light-border dark:border-dark-border p-4 sm:p-6"
							>
								<div class="flex items-center justify-between">
									<Heading tag="h3" class="text-2xl font-semibold text-light-base dark:text-dark-base">
										{operator.name}
									</Heading>
									<div class="absolute top-4 sm:top-5 right-4">
										<More />
									</div>
								</div>
								<div class="mt-5 flex pt-3">
									<Badge
										color={operator.status.connected ? 'green' : 'red'}
										rounded
										class="px-2.5 py-1 flex items-center"
									>
										<Indicator color={operator.status.connected ? 'green' : 'red'} size="xs" class="me-1" />
										<p class="text-sm/4"> NATS {operator.status.connected ? 'Connected' : 'Disconnected'}</p>
									</Badge>
									{#if operator.status.connected && operator.status.connect_time}
        <span class="flex ml-2 mt-1 text-xs text-light-base dark:text-dark-base break-words overflow-hidden">
          {formatEpochSeconds(operator.status.connect_time)}
        </span>
									{/if}
								</div>
							</Card>
						</a>
					{/each}
					{#if hasMore}
						<div class="col-span-3 flex justify-center">
							<Button size="sm" on:click={fetchNextPage}>
								{#if loading}
									<Spinner size={4} color="gray" />
								{:else}
									Load More
								{/if}
							</Button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</main>

<CreateOperatorModal bind:operators bind:open={openCreateOperatorModal} />
