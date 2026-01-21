<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import TabGroup from '$lib/components/ui/tab/TabGroup.svelte';
	import TabCard from '$lib/components/ui/tab/TabCard.svelte';
	import UserOverview from '$lib/components/ui/user/UserOverview.svelte';
	import UserIssuancesTable, {
		type UserIssuancesTableApi,
	} from '$lib/components/ui/user/UserIssuancesTable.svelte';
	import UserGetConnected from '$lib/components/ui/user/UserGetConnected.svelte';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountResponse, OperatorResponse, UserResponse } from '$lib/models/entity';
	import { page } from '$app/state';
	import { showError } from '$lib/stores/toast';

	import Home from '@lucide/svelte/icons/home';

	const namespaceId = $derived(page.params.namespace ?? '');
	const operatorId = $derived(page.params.operator ?? '');
	const accountId = $derived(page.params.account ?? '');
	const userId = $derived(page.params.user ?? '');

	let loading = $state(true);
	let loadFailed = $state(false);
	let operator = $state<OperatorResponse | undefined>(undefined);
	let account = $state<AccountResponse | undefined>(undefined);
	let user = $state<UserResponse | undefined>(undefined);
	let issuancesApi = $state<UserIssuancesTableApi | undefined>(undefined);

	const client = new CoroClient();

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
			user = await client.fetchUser(userId);
		} catch (e) {
			showError(e as Error);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{user?.name ? `${user.name} - Coro` : 'User - Coro'}</title>
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
					<Breadcrumb.Link href={`/namespaces/${namespaceId}/operators/${operatorId}/${accountId}`}>
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
						href={`/namespaces/${namespaceId}/operators/${operatorId}/${accountId}?tab=2`}
					>
						Users
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>
						{#if loading}
							<Skeleton class="h-4 w-24" />
						{:else}
							{user?.name}
						{/if}
					</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-6">
			{#if loading}
				<Skeleton class="h-9 w-48" />
			{:else}
				<h1 class="text-3xl font-bold">{user?.name}</h1>
			{/if}
		</div>

		<TabGroup tabNames={['Overview', 'Connect']}>
			{#snippet children(tab)}
				{#if tab === 1}
					<TabCard>
						{#if user}
							<UserOverview
								bind:loading
								bind:user
								accountUserJWTLifetime={account?.limits.user_jwt_duration_secs}
							/>
						{/if}
					</TabCard>
				{:else if tab === 2}
					<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
						<Card.Root>
							<Card.Content class="p-6">
								<UserGetConnected userId={user?.id} {issuancesApi} />
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Content class="p-6">
								<h2 class="mb-6 text-xl font-semibold sm:text-2xl">Credentials Issued</h2>
								{#if user}
									<UserIssuancesTable {user} bind:api={issuancesApi} />
								{/if}
							</Card.Content>
						</Card.Root>
					</div>
				{/if}
			{/snippet}
		</TabGroup>
	{/if}
</main>
