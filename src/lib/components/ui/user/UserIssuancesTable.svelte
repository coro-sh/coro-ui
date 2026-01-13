<script lang="ts" module>
	export interface UserIssuancesTableApi {
		handleNewIssuance: () => Promise<void>;
	}
</script>

<script lang="ts">
	import type { UserIssuanceResponse, UserResponse } from '$lib/models/entity';
	import { CoroClient } from '$lib/coro-client';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import { formatEpoch } from '$lib/utils';
	import { showError } from '$lib/stores/toast';
	import { onMount } from 'svelte';
	import { untrack } from 'svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		user: UserResponse;
		api?: UserIssuancesTableApi;
	}

	let { user, api = $bindable() }: Props = $props();

	const client = new CoroClient();
	const pageSize = 9;
	const columns = ['Issued', 'Expiry', 'Status'];

	let paginator: ReturnType<typeof client.paginateUserIssuances> | null = null;
	let issuances = $state<UserIssuanceResponse[]>([]);
	let loadingFirstPage = $state(true);
	let hasMoreIssuances = $state(false);
	let loadingMore = $state(false);
	let initialFetchDone = false;

	// Expose API to parent once on mount
	onMount(() => {
		api = { handleNewIssuance };
	});

	// Fetch data when user becomes available
	$effect(() => {
		const userId = user?.id;
		if (userId && !initialFetchDone) {
			untrack(() => {
				initialFetchDone = true;
				paginator = client.paginateUserIssuances(userId, pageSize);
				loadingFirstPage = true;
				fetchNextIssuancesPage().then(() => {
					loadingFirstPage = false;
				});
			});
		}
	});

	async function handleNewIssuance() {
		if (!paginator) return;
		const count = issuances.length;
		paginator.reset();
		paginator.size = count + 1;
		await fetchNextIssuancesPage(true);
		paginator.size = pageSize;
	}

	async function fetchNextIssuancesPage(isReset = false) {
		if (!paginator) return;
		try {
			const page = await paginator.fetchNext();
			if (isReset) {
				issuances = page;
			} else {
				issuances = [...issuances, ...page];
			}
			hasMoreIssuances = paginator.hasNext();
		} catch (e) {
			showError(e as Error);
		}
	}

	function handleLoadMore() {
		loadingMore = true;
		fetchNextIssuancesPage().finally(() => {
			loadingMore = false;
		});
	}
</script>

<div class="overflow-x-auto max-h-[580px] overflow-y-auto">
	<Table.Root>
		<Table.Header class="sticky top-0 bg-muted">
			<Table.Row>
				{#each columns as title}
					<Table.Head class="font-medium whitespace-nowrap">{title}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if loadingFirstPage}
				<Table.Row>
					{#each columns as _}
						<Table.Cell>
							<Skeleton class="h-4 w-24" />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else if !issuances.length}
				<Table.Row>
					<Table.Cell colspan={columns.length}>
						<div class="text-center text-muted-foreground my-20">
							<p>No credentials issued</p>
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				{#each issuances as iss, i (iss.issue_time)}
					<Table.Row class={i < issuances.length - 1 ? 'border-b' : ''}>
						<Table.Cell>{formatEpoch(iss.issue_time)}</Table.Cell>
						<Table.Cell>{iss.expire_time ? formatEpoch(iss.expire_time) : 'N/A'}</Table.Cell>
						<Table.Cell>{iss.active ? 'Active' : 'Expired'}</Table.Cell>
					</Table.Row>
				{/each}
			{/if}
			{#if hasMoreIssuances}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="pt-4">
						<div class="flex justify-center">
							<Button variant="outline" size="sm" onclick={handleLoadMore} disabled={loadingMore}>
								{#if loadingMore}
									<LoaderCircle class="size-4 animate-spin" />
								{:else}
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
