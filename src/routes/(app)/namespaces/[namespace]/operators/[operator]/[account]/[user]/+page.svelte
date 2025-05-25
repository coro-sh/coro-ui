<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { AccountResponse, OperatorResponse, UserResponse } from '$lib/models/entity';
	import TabGroup from '$lib/components/tab/TabGroup.svelte';
	import TabCard from '$lib/components/tab/TabCard.svelte';
	import UserOverview from '$lib/components/user/UserOverview.svelte';
	import { CoroClient } from '$lib/coro-client';
	import BreadcrumbItem from '$lib/components/breacrumb/BreadcrumbItem.svelte';
	import Breadcrumb from '$lib/components/breacrumb/Breadcrumb.svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import UserIssuancesTable from '$lib/components/user/UserIssuancesTable.svelte';
	import UserGetConnected from '$lib/components/user/UserGetConnected.svelte';
	import { showErrorToast } from '$lib/stores/toast';

	const operatorId = $page.params.operator;
	const accountId = $page.params.account;
	const userId = $page.params.user;

	let loading = true;
	let operator: OperatorResponse;
	let account: AccountResponse;
	let user: UserResponse;

	let loadFailed = false;

	const client = new CoroClient();
	let issuancesComponent: UserIssuancesTable;

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			account = await client.fetchAccount(accountId);
			user = await client.fetchUser(userId);
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
			<BreadcrumbItem href="/namespaces/{$activeNamespaceId}/operators/{operatorId}/{accountId}?tab=3">Users
			</BreadcrumbItem>
			<BreadcrumbItem {loading}
											href="/namespaces/{$activeNamespaceId}/operators/{operatorId}/{accountId}/{userId}">{user?.name}</BreadcrumbItem>
		</Breadcrumb>

		<div class="mb-3 items-center">
			<span class="text-3xl font-bold leading-none text-light-base dark:text-dark-base">
				{#if loading}
					<div class="mt-10 mb-10">
						<PlaceholderLine width="2/12" />
					</div>
				{:else}
					{user.name}
				{/if}
			</span>
		</div>
		<TabGroup tabNames={['Overview', 'Connect']} slotsNoContentWrapper={[2]}>
			<div slot="1">
				<TabCard>
					<UserOverview bind:loading bind:user accountUserJWTLifetime={account?.limits.user_jwt_duration_secs} />
				</TabCard>
			</div>
			<div slot="2">
				<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
					<Card size="xl"
								class="shadow-sm max-w-none dark:bg-dark-content border-light-border dark:border-dark-border">
						<div class="m-4 -mb-4">
							<UserGetConnected userId={user?.id} issuancesComponent={issuancesComponent} />
						</div>
					</Card>
					<Card size="xl"
								class="shadow-sm max-w-none dark:bg-dark-content border-light-border dark:border-dark-border">
						<div class="m-4">
							<Heading tag="h2"
											 class="mb-6 text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2">
								Credentials Issued
							</Heading>
							<UserIssuancesTable user={user} bind:this={issuancesComponent} />
						</div>
					</Card>
				</div>
			</div>
		</TabGroup>
	{/if}
</main>
