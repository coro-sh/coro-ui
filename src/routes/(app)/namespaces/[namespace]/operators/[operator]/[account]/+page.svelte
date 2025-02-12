<script lang="ts">
	import UsersTable from '$lib/components/user/UsersTable.svelte';
	import AccountOverview from '$lib/components/account/AccountOverview.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { AccountResponse, OperatorResponse, UserResponse } from '$lib/models/entity';
	import TabGroup from '$lib/components/tab/TabGroup.svelte';
	import TabCard from '$lib/components/tab/TabCard.svelte';
	import CreateUserModal from '$lib/components/user/CreateUserModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import Breadcrumb from '$lib/components/breacrumb/Breadcrumb.svelte';
	import BreadcrumbItem from '$lib/components/breacrumb/BreadcrumbItem.svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import { showErrorToast } from '$lib/stores/toast';

	const operatorId = $page.params.operator;
	const accountId = $page.params.account;

	let loading = true;
	let loadingMoreUsers = false;
	let loadFailed = false;
	let openCreateUser = false;
	let operator: OperatorResponse;
	let account: AccountResponse;
	let users: UserResponse[] = [];
	let hasMoreUsers = false;

	const client = new CoroClient();
	const paginator = client.paginateUsers(accountId);

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
			await fetchNextUsersPage();
		} catch (e) {
			showErrorToast(e);
			loadFailed = true;
		} finally {
			loading = false;
		}
	});

	async function fetchNextUsersPage() {
		loadingMoreUsers = true;
		try {
			const page = await paginator.fetchNext();
			users = [...users, ...page];
			hasMoreUsers = paginator.hasNext();
		} catch (e) {
			showErrorToast(e);
		} finally {
			loadingMoreUsers = false;
		}
	}
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
		</Breadcrumb>

		<div class="mb-3 items-center">
			<span class="text-3xl font-bold leading-none text-light-base dark:text-dark-base">
				{#if loading}
					<div class="mt-10 mb-10">
						<PlaceholderLine width="2/12" />
					</div>
				{:else}
					{account?.name}
				{/if}
			</span>
		</div>

		<TabGroup tabNames={['Overview', 'Users']}>
			<div slot="1">
				<TabCard>
					<AccountOverview bind:loading bind:account />
				</TabCard>
			</div>
			<div slot="2">
				<TabCard>
					<UsersTable bind:loading bind:openCreateModal={openCreateUser} bind:hasMore={hasMoreUsers}
											bind:loadingMore={loadingMoreUsers} users={users}
											on:loadMore={fetchNextUsersPage} />
				</TabCard>
			</div>
		</TabGroup>
	{/if}
</main>

<CreateUserModal bind:users bind:open={openCreateUser} accountId={account?.id ?? ''} />
