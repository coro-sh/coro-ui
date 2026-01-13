<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import AccountsTable from '$lib/components/ui/account/AccountsTable.svelte';
	import CreateAccountModal from '$lib/components/ui/account/CreateAccountModal.svelte';
	import CodeBlock from '$lib/components/ui/text/CodeBlock.svelte';
	import OperatorOverview from '$lib/components/ui/operator/OperatorOverview.svelte';
	import TabGroup from '$lib/components/ui/tab/TabGroup.svelte';
	import TabCard from '$lib/components/ui/tab/TabCard.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountResponse, OperatorResponse } from '$lib/models/entity';
	import { page } from '$app/state';
	import { downloadFile } from '$lib/utils';
	import { showError, showSuccess } from '$lib/stores/toast';
	import { newError } from '$lib/error';

	import Home from '@lucide/svelte/icons/home';
	import Circle from '@lucide/svelte/icons/circle';
	import Download from '@lucide/svelte/icons/download';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import CloudUpload from '@lucide/svelte/icons/cloud-upload';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	const namespaceId = $derived(page.params.namespace ?? '');
	const operatorId = $derived(page.params.operator ?? '');

	let loading = $state(true);
	let loadingNatsConfig = $state(true);
	let loadingProxyToken = $state(false);
	let loadingTestConnection = $state(false);
	let loadingMoreAccounts = $state(false);
	let loadFailed = $state(false);
	let openCreateAccount = $state(false);
	let operator = $state<OperatorResponse | undefined>(undefined);
	let accounts = $state<AccountResponse[]>([]);
	let hasMoreAccounts = $state(false);
	let natsConfig = $state('');
	let proxyToken = $state('');

	let proxyAgentCmd = $state(`docker run --rm corosh/coro-proxy-agent  \\
	--token <PROXY_TOKEN> \\
	--nats-url nats://<NATS_HOST_PORT> \\
	--broker-url ws://<BROKER_HOST_PORT>/api/v1/broker`);

	const client = new CoroClient();
	const paginator = $derived(client.paginateAccounts(operatorId));

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			await fetchNextAccountsPage();
			loadingNatsConfig = true;
			natsConfig = await client.fetchNATSConfigContent(operatorId);
		} catch (e) {
			showError(e as Error);
			loadFailed = true;
		} finally {
			loading = false;
			loadingNatsConfig = false;
		}
	});

	async function fetchNextAccountsPage() {
		loadingMoreAccounts = true;
		try {
			const pageData = await paginator.fetchNext();
			accounts = [...accounts, ...pageData];
			hasMoreAccounts = paginator.hasNext();
		} catch (e) {
			showError(e as Error);
		} finally {
			loadingMoreAccounts = false;
		}
	}

	async function generateProxyToken() {
		try {
			loadingProxyToken = true;
			const res = await client.createOperatorProxyToken(operatorId);
			proxyToken = res.token;
			proxyAgentCmd = proxyAgentCmd.replace('<PROXY_TOKEN>', proxyToken);
		} catch (e) {
			showError(e as Error);
		} finally {
			loadingProxyToken = false;
		}
	}

	async function testNATSConnection() {
		if (!operator) return;
		try {
			loadingTestConnection = true;
			operator.status = await client.getOperatorProxyStatus(operatorId);
			if (operator.status.connected) {
				showSuccess('NATS server connected');
			} else {
				showError(newError('NATS server not connected'));
			}
		} catch (e) {
			showError(e as Error);
		} finally {
			loadingTestConnection = false;
		}
	}
</script>

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
					<Breadcrumb.Page>
						{#if loading}
							<Skeleton class="h-4 w-24" />
						{:else}
							{operator?.name}
						{/if}
					</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div class="mb-6">
			{#if loading}
				<Skeleton class="h-9 w-48" />
			{:else}
				<h1 class="text-3xl font-bold">{operator?.name}</h1>
			{/if}
		</div>

		<TabGroup tabNames={['Overview', 'NATS', 'Accounts']}>
			{#snippet children(tab)}
				{#if tab === 1}
					<TabCard>
						{#if operator}
							<OperatorOverview bind:loading bind:operator />
						{/if}
					</TabCard>
				{:else if tab === 2}
					<TabCard>
						{#if loading}
							<div class="space-y-4">
								{#each { length: 5 } as _}
									<Skeleton class="h-4 w-full" />
								{/each}
							</div>
						{:else if operator?.status.connected}
							<div class="mb-8 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<h2 class="text-xl font-semibold sm:text-2xl">NATS Server</h2>
									<Badge variant="success" class="mt-0.5 flex items-center gap-1">
										<Circle class="size-1.5! fill-current" />
										Connected
									</Badge>
								</div>
							</div>

							<p class="text-muted-foreground mb-5">Connected with the server config below.</p>

							<CodeBlock loading={loadingNatsConfig} content={natsConfig} wrap />
						{:else}
							<div
								class="bg-muted/30 dark:bg-muted/50 -mx-2 -mt-2 mb-6 flex items-center justify-center gap-3 rounded-lg p-4"
							>
								<Badge variant="destructive" class="flex w-fit items-center gap-1">
									<Circle class="size-1.5! fill-current" />
									Disconnected
								</Badge>
								<span class="text-foreground text-sm">NATS server not connected</span>
							</div>

							<div class="mb-4 flex items-center justify-between">
								<h2 class="text-xl font-semibold sm:text-2xl">Connect a new NATS server</h2>
							</div>

							<div class="space-y-8">
								<!-- Step 1 -->
								<div class="flex gap-4">
									<div class="flex flex-col items-center">
										<div
											class="bg-muted flex size-8 items-center justify-center rounded-full font-medium"
										>
											1
										</div>
										<div class="bg-border mt-2 h-full w-px"></div>
									</div>
									<div class="flex-1 pb-8">
										<h3 class="mb-2 font-semibold">Server config</h3>
										<p class="text-muted-foreground mb-4">
											Download the NATS server config for your Operator.
										</p>
										<Button
											variant="outline"
											onclick={() => downloadFile(natsConfig, 'nats.conf')}
											class="mb-4"
										>
											<Download class="size-4" />
											Download Config
										</Button>
										<p class="text-muted-foreground mb-2">Preview:</p>
										<CodeBlock loading={loadingNatsConfig} content={natsConfig} wrap />
									</div>
								</div>

								<!-- Step 2 -->
								<div class="flex gap-4">
									<div class="flex flex-col items-center">
										<div
											class="bg-muted flex size-8 items-center justify-center rounded-full font-medium"
										>
											2
										</div>
										<div class="bg-border mt-2 h-full w-px"></div>
									</div>
									<div class="flex-1 pb-8">
										<h3 class="mb-2 font-semibold">Start the server</h3>
										<p class="text-muted-foreground mb-4">
											Start your Operator NATS server using the saved config.
										</p>
										<CodeBlock loading={false} content="nats-server -c nats.conf" />
									</div>
								</div>

								<!-- Step 3 -->
								<div class="flex gap-4">
									<div class="flex flex-col items-center">
										<div
											class="bg-muted flex size-8 items-center justify-center rounded-full font-medium"
										>
											3
										</div>
										<div class="bg-border mt-2 h-full w-px"></div>
									</div>
									<div class="flex-1 pb-8">
										<h3 class="mb-2 font-semibold">Proxy Agent token</h3>
										<p class="text-muted-foreground mb-4">
											Generate a new Proxy Agent authorization token. Please note that it cannot be
											retrieved again later and must be regenerated if lost.
										</p>
										{#if proxyToken}
											<CodeBlock loading={false} content={proxyToken} />
										{:else}
											<Button
												onclick={generateProxyToken}
												class="min-w-52"
												disabled={loadingProxyToken}
											>
												{#if loadingProxyToken}
													<LoaderCircle class="size-4 animate-spin" />
												{:else}
													<RefreshCw class="size-4" />
													Generate Proxy Token
												{/if}
											</Button>
										{/if}
									</div>
								</div>

								<!-- Step 4 -->
								<div class="flex gap-4">
									<div class="flex flex-col items-center">
										<div
											class="bg-muted flex size-8 items-center justify-center rounded-full font-medium"
										>
											4
										</div>
									</div>
									<div class="flex-1">
										<h3 class="mb-2 font-semibold">Run the Proxy Agent</h3>
										<p class="text-muted-foreground mb-4">
											The Coro Proxy Agent is a lightweight service that connects your Operator NATS
											server to Coro. You can run the service as a Docker container using the latest
											Coro Proxy Agent image.
										</p>
										<CodeBlock loading={false} content={proxyAgentCmd} />
										<Button
											class="mt-5 min-w-44"
											onclick={testNATSConnection}
											disabled={loadingTestConnection}
										>
											{#if loadingTestConnection}
												<LoaderCircle class="size-4 animate-spin" />
											{:else}
												<CloudUpload class="size-4" />
												Test Connection
											{/if}
										</Button>
									</div>
								</div>
							</div>
						{/if}
					</TabCard>
				{:else if tab === 3}
					<TabCard>
						<AccountsTable
							bind:loading
							bind:openCreateModal={openCreateAccount}
							bind:hasMore={hasMoreAccounts}
							bind:loadingMore={loadingMoreAccounts}
							{accounts}
							onloadmore={fetchNextAccountsPage}
						/>
					</TabCard>
				{/if}
			{/snippet}
		</TabGroup>
	{/if}
</main>

<CreateAccountModal bind:accounts bind:open={openCreateAccount} operatorId={operator?.id ?? ''} />
