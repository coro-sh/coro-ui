<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import UsersTable from '$lib/components/ui/user/UsersTable.svelte';
	import StreamsTable from '$lib/components/ui/stream/StreamsTable.svelte';
	import AccountOverview from '$lib/components/ui/account/AccountOverview.svelte';
	import TabGroup from '$lib/components/ui/tab/TabGroup.svelte';
	import TabCard from '$lib/components/ui/tab/TabCard.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import CreateUserModal from '$lib/components/ui/user/CreateUserModal.svelte';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountResponse, OperatorResponse, UserResponse, Stream } from '$lib/models/entity';
	import { page } from '$app/state';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { showError } from '$lib/stores/toast';

	import Home from '@lucide/svelte/icons/home';

	const namespaceId = $derived(page.params.namespace ?? '');
	const operatorId = $derived(page.params.operator ?? '');
	const accountId = $derived(page.params.account ?? '');
	const activeTab = $derived.by(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const tabParam = urlParams.get('tab');
		return tabParam ? parseInt(tabParam) : 1;
	});

	let loading = $state(true);
	let loadingMoreUsers = $state(false);
	let loadingStreams = $state(false);
	let loadFailed = $state(false);
	let openCreateUser = $state(false);
	let streamsFetched = $state(false);
	let operator = $state<OperatorResponse | undefined>(undefined);
	let account = $state<AccountResponse | undefined>(undefined);
	let users = $state<UserResponse[]>([]);
	let hasMoreUsers = $state(false);
	let streams = $state<Stream[]>([]);

	const client = new CoroClient();
	const paginator = $derived(client.paginateUsers(accountId));

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
			await fetchNextUsersPage();
		} catch (e) {
			showError(e as Error);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});

	$effect(() => {
		// Fetch streams when tab 3 is active and we haven't fetched yet
		if (activeTab === 3 && operator?.status.connected && !streamsFetched && !loadingStreams) {
			void fetchStreams();
		}
	});

	async function fetchNextUsersPage() {
		loadingMoreUsers = true;
		try {
			const pageData = await paginator.fetchNext();
			users = [...users, ...pageData];
			hasMoreUsers = paginator.hasNext();
		} catch (e) {
			showError(e as Error);
		} finally {
			loadingMoreUsers = false;
		}
	}

	async function fetchStreams() {
		if (!operator?.status.connected || streamsFetched || loadingStreams) return;

		loadingStreams = true;
		try {
			const result = await client.listStreams(accountId);
			// Ensure we always have a valid array
			streams = Array.isArray(result) ? result : [];
		} catch (e) {
			showError(e as Error);
			streams = []; // Reset to empty array on error
		} finally {
			loadingStreams = false;
			streamsFetched = true;
		}
	}
</script>

<svelte:head>
	<title>{account?.name ? `${account.name} - Coro` : 'Account - Coro'}</title>
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
					<Breadcrumb.Page>
						{#if loading}
							<Skeleton class="h-4 w-24" />
						{:else}
							{account?.name}
						{/if}
					</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-6">
			{#if loading}
				<Skeleton class="h-9 w-48" />
			{:else}
				<h1 class="text-3xl font-bold">{account?.name}</h1>
			{/if}
		</div>

		<TabGroup tabNames={['Overview', 'Users', 'Streams']}>
			{#snippet children(tab)}
				{#if tab === 1}
					<TabCard>
						{#if account}
							<AccountOverview bind:loading bind:account />
						{/if}
					</TabCard>
				{:else if tab === 2}
					<TabCard>
						<UsersTable
							bind:loading
							bind:openCreateModal={openCreateUser}
							bind:hasMore={hasMoreUsers}
							bind:loadingMore={loadingMoreUsers}
							{users}
							onloadmore={fetchNextUsersPage}
						/>
					</TabCard>
				{:else if tab === 3}
					<TabCard>
						{#if operator}
							<StreamsTable
								bind:loading={loadingStreams}
								{streams}
								{accountId}
								{operatorId}
								disabled={!operator.status.connected}
							/>
						{/if}
					</TabCard>
				{/if}
			{/snippet}
		</TabGroup>
	{/if}
</main>

<CreateUserModal
	bind:users
	bind:open={openCreateUser}
	accountId={account?.id ?? ''}
	accountUserJWTLifetime={account?.limits.user_jwt_duration_secs}
/>
