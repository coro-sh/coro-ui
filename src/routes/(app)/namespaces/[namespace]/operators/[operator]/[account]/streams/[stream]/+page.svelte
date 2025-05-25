<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { AccountResponse, OperatorResponse, StreamResponse } from '$lib/models/entity';
	import { CoroClient } from '$lib/coro-client';
	import BreadcrumbItem from '$lib/components/breacrumb/BreadcrumbItem.svelte';
	import Breadcrumb from '$lib/components/breacrumb/Breadcrumb.svelte';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import { showErrorToast } from '$lib/stores/toast';
	import StreamOverview from '$lib/components/jetstream/StreamOverview.svelte';
	import StreamMessagesTable from '$lib/components/jetstream/StreamMessagesTable.svelte';
	import { Card, Heading } from 'flowbite-svelte';

	const operatorId = $page.params.operator;
	const accountId = $page.params.account;
	const streamName = $page.params.stream;

	let loading = true;
	let loadFailed = false;
	let operator: OperatorResponse;
	let account: AccountResponse;
	let stream: StreamResponse;

	const client = new CoroClient();

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
			stream = await client.fetchStream(accountId, streamName);
		} catch (e) {
			showErrorToast(e);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});
</script>

<main>
	{#if loadFailed}
		<ErrorLoadResourceSection />
	{:else}
		<Breadcrumb marginBot={8}>
			<BreadcrumbItem {loading}
											href="/namespaces/{$activeNamespaceId}/operators/{operatorId}">{operator?.name}</BreadcrumbItem>
			<BreadcrumbItem href="/namespaces/{$activeNamespaceId}/operators/{operatorId}?tab=3">Accounts</BreadcrumbItem>
			<BreadcrumbItem {loading}
											href="/namespaces/{$activeNamespaceId}/operators/{operatorId}/{accountId}">{account?.name}</BreadcrumbItem>
			<BreadcrumbItem href="/namespaces/{$activeNamespaceId}/operators/{operatorId}/{accountId}?tab=2">Streams
			</BreadcrumbItem>
			<BreadcrumbItem {loading}
											href="/namespaces/{$activeNamespaceId}/operators/{operatorId}/{accountId}/streams/{stream}">{stream?.name}</BreadcrumbItem>
		</Breadcrumb>

		<StreamOverview bind:loading bind:stream />
		<Card size="xl"
					class="shadow-sm max-w-none dark:bg-dark-content border-light-border dark:border-dark-border">
			<div class="m-4">
				<Heading tag="h2"
								 class="mb-6 text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2">
					Credentials Issued
				</Heading>
			</div>
			<div class="m-4 -mb-4">
				<StreamMessagesTable accountId={accountId} streamName={streamName} />
			</div>
		</Card>
	{/if}
</main>
