<script lang="ts">
	import type { UserIssuanceResponse, UserResponse } from '$lib/models/entity';
	import { CoroClient } from '$lib/coro-client';
	import {
		Button,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import { Paginator } from '$lib/http';
	import { formatEpoch } from '$lib/util';
	import { showErrorToast } from '$lib/stores/toast';

	export let user: UserResponse;

	const client = new CoroClient();
	const pageSize = 9;

	let paginator: Paginator<UserIssuanceResponse>;
	let issuances: UserIssuanceResponse[] = [];
	let firstPageFetched = false;
	let hasMoreIssuances = false;
	let loadingFirstPage = true;
	let loadingMore = false;

	$: if (user && !firstPageFetched) {
		paginator = client.paginateUserIssuances(user.id, pageSize);
		loadingFirstPage = true;
		fetchNextIssuancesPage();
		loadingFirstPage = false;
		firstPageFetched = true;
	}

	const columns = ['Issued', 'Expiry', 'Status'];


	export async function handleNewIssuance() {
		const count = issuances.length;
		paginator.reset();
		paginator.size = count + 1;
		await fetchNextIssuancesPage(true);
		paginator.size = pageSize;
	}

	async function fetchNextIssuancesPage(isReset = false) {
		try {
			const page = await paginator.fetchNext();
			if (isReset) {
				issuances.length = 0;
			}
			issuances = [...issuances, ...page];
			hasMoreIssuances = paginator.hasNext();
		} catch (e) {
			showErrorToast(e);
		}
	}

	function handleLoadMore() {
		loadingMore = true;
		fetchNextIssuancesPage();
		loadingMore = false;
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
			{#if loadingFirstPage}
				<TableBodyRow>
					{#each columns as col}
						{#if col}
							<TableBodyCell class="p-4">
								<PlaceholderBlock lines={1} />
							</TableBodyCell>
						{/if}
					{/each}
				</TableBodyRow>
			{:else}
				{#if !issuances.length}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length}>
							<div class="text-base text-center items-center text-mono-500 my-56">
								<p>No credentials issued</p>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					{#each issuances as iss, i}
						<TableBodyRow
							class={i < issuances.length - 1 ? 'border-b border-light-border dark:border-dark-border' : ''}>
							<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
								{formatEpoch(iss.issue_time)}
							</TableBodyCell>
							<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
								{iss.expire_time ? formatEpoch(iss.expire_time) : 'N/A'}
							</TableBodyCell>
							<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
								{iss.active ? "Active" : "Expired"}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/if}
				{#if hasMoreIssuances}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length} class="py-1">
							<div class="flex justify-center">
								<Button size="sm" on:click={handleLoadMore}>
									{#if loadingMore}
										<Spinner size={4} color="gray" />
									{:else}
										Load More
									{/if}
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/if}
		</TableBody>
	</Table>
</div>
