<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import StreamOverview from '$lib/components/ui/stream/StreamOverview.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountResponse, OperatorResponse } from '$lib/models/entity';
	import { showError } from '$lib/stores/toast';

	import Home from '@lucide/svelte/icons/home';

	const namespaceId = $derived(page.params.namespace ?? '');
	const operatorId = $derived(page.params.operator ?? '');
	const accountId = $derived(page.params.account ?? '');
	const streamName = $derived(decodeURIComponent(page.params.stream ?? ''));

	let loading = $state(true);
	let loadFailed = $state(false);
	let operator = $state<OperatorResponse | undefined>(undefined);
	let account = $state<AccountResponse | undefined>(undefined);

	const client = new CoroClient();

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
		} catch (e) {
			showError(e as Error);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{streamName ? `${streamName} - Coro` : 'Stream - Coro'}</title>
</svelte:head>

<main>
	{#if loadFailed}
		<ErrorLoadResourceSection />
	{:else}
		<Breadcrumb.Root class="mb-8">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href={`/namespaces/${namespaceId}/operators`}
						class="flex items-center gap-2"
					>
						<Home class="size-4" />
						Operators
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href={`/namespaces/${namespaceId}/operators/${operatorId}`}>
						{#if loading}
							<Skeleton class="h-4 w-24" />
						{:else}
							{operator?.name}
						{/if}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href={`/namespaces/${namespaceId}/operators/${operatorId}?tab=3`}>
						Accounts
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href={`/namespaces/${namespaceId}/operators/${operatorId}/${accountId}?tab=3`}
					>
						{#if loading}
							<Skeleton class="h-4 w-24" />
						{:else}
							{account?.name}
						{/if}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href={`/namespaces/${namespaceId}/operators/${operatorId}/${accountId}?tab=3`}
					>
						Streams
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>
						{streamName}
					</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-6">
			<h1 class="text-3xl font-bold">{streamName}</h1>
		</div>

		<StreamOverview {accountId} {streamName} />
	{/if}
</main>
