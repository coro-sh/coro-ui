<script lang="ts">
	import { Badge, Banner, Button, Heading, Indicator, Spinner, Timeline, TimelineItem } from 'flowbite-svelte';
	import AccountsTable from '$lib/components/account/AccountsTable.svelte';
	import CreateAccountModal from '$lib/components/account/CreateAccountModal.svelte';
	import CodeBlock from '$lib/components/text/CodeBlock.svelte';
	import OperatorOverview from '$lib/components/operator/OperatorOverview.svelte';
	import { onMount } from 'svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountResponse, OperatorResponse } from '$lib/models/entity';
	import { page } from '$app/stores';
	import TabGroup from '$lib/components/tab/TabGroup.svelte';
	import TabCard from '$lib/components/tab/TabCard.svelte';
	import Breadcrumb from '$lib/components/breacrumb/Breadcrumb.svelte';
	import BreadcrumbItem from '$lib/components/breacrumb/BreadcrumbItem.svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import { CloudArrowUpOutline, DownloadSolid } from 'flowbite-svelte-icons';
	import { downloadFile } from '$lib/util.js';
	import { plaintext } from 'svelte-highlight/languages';
	import { showErrorToast, showSuccessToast } from '$lib/stores/toast';
	import { newError } from '$lib/error';

	const operatorId = $page.params.operator;

	let loading = true;
	let loadingNatsConfig = true;
	let loadingProxyToken = false;
	let loadingTestConnection = false;
	let loadingMoreAccounts = false;
	let loadFailed = false;
	let openCreateAccount = false;
	let operator: OperatorResponse;
	let accounts: AccountResponse[] = [];
	let hasMoreAccounts = false;
	let natsConfig: string;
	let proxyToken = '';

	let proxyAgentCmd = `docker run --rm corosh/coro-proxy-agent  \\
	--token <PROXY_TOKEN> \\
	--nats-url nats://<NATS_HOST_PORT> \\
	--broker-url ws://<BROKER_HOST_PORT>/api/v1/broker`;

	const client = new CoroClient();
	const paginator = client.paginateAccounts(operatorId);

	onMount(async () => {
		loading = true;
		try {
			operator = await client.fetchOperator(operatorId);
			await fetchNextAccountsPage();
			loadingNatsConfig = true;
			natsConfig = await client.fetchNATSConfigContent(operatorId);
		} catch (e) {
			showErrorToast(e);
			loadFailed = true;
		} finally {
			loading = false;
			loadingNatsConfig = false;
		}
	});

	async function fetchNextAccountsPage() {
		loadingMoreAccounts = true;
		try {
			const page = await paginator.fetchNext();
			accounts = [...accounts, ...page];
			hasMoreAccounts = paginator.hasNext();
		} catch (e) {
			showErrorToast(e);
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
			showErrorToast(e);
		} finally {
			loadingProxyToken = false;
		}
	}

	async function testNATSConnection() {
		try {
			loadingTestConnection = true;
			operator.status = await client.getOperatorProxyStatus(operatorId);
			if (operator.status.connected) {
				showSuccessToast('NATS server connected');
			} else {
				showErrorToast(newError('NATS server not connected'));
			}
		} catch (e) {
			showErrorToast(e);
		} finally {
			loadingTestConnection = false;
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
		</Breadcrumb>

		<div class="mb-3 items-center">
			<span class="text-3xl font-bold leading-none text-light-base dark:text-dark-base">
				{#if loading}
					<div class="mt-10 mb-10">
						<PlaceholderLine width="2/12" />
					</div>
				{:else}
					{operator?.name}
				{/if}
			</span>
		</div>

		<TabGroup tabNames={['Overview', 'NATS', 'Accounts']}>
			<div slot="1">
				<TabCard>
					<OperatorOverview bind:loading bind:operator={operator} />
				</TabCard>
			</div>
			<div slot="2">
				<div>
					{#if !loading && !operator.status.connected}
						<Banner bannerType="signup" dismissable={false}
										divClass="z-10 flex justify-between p-4 dark:bg-mono-600/70 dark:border-gray-600 rounded-md">
							<p class="flex items-center text-sm font-normal">
							<span class="inline-flex p-0.5 me-3">
								<Badge color="red" rounded class="px-2.5 py-0.5">
									<Indicator color="red" size="xs" class="me-1" />
									Disconnected
								</Badge>
							</span>
								NATS server not connected
							</p>
						</Banner>
					{/if}
				</div>
				<TabCard>
					{#if loading}
						<PlaceholderBlock lines={20} />
					{:else if operator.status.connected}
						<Heading tag="h2"
										 class="text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2 mb-8">
							<div class="flex items-center gap-2">
								NATS Server
								<Badge color="green" rounded class="ml-1 mt-0.5 px-2.5 py-0.5 flex items-center">
									<Indicator color="green" size="xs" class="me-1" />
									Connected
								</Badge>
							</div>
						</Heading>

						<p class="mb-5 text-base text-light-base dark:text-dark-base">
							Connected with the server config below.
						</p>

						<div> <!-- border color is being overriden unless the code block is wrapped in a div -->
							<CodeBlock bind:loading={loadingNatsConfig} content={natsConfig} />
						</div>
					{:else}
						<div class="flex justify-between items-center mb-4">
							<Heading tag="h2"
											 class="text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2">
								Connect a new NATS server
							</Heading>
						</div>
						<Timeline order="vertical">
							<TimelineItem title="Server config">
								<svelte:fragment slot="icon">
								<span
									class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										1
									</span>
								</svelte:fragment>
								<div class="my-4">
									<p class="mb-3 text-base text-light-base dark:text-dark-base">
										Download the NATS server config for your Operator.
									</p>
								</div>
								<Button color="alternative" on:click={()=>{downloadFile(natsConfig, 'nats.conf')}} class="px-4 mb-5">
									<DownloadSolid class="mr-2" size="sm" />
									Download Config
								</Button>
								<p class="mb-3 text-base text-light-base dark:text-dark-base">
									Preview:
								</p>
								<CodeBlock bind:loading={loadingNatsConfig} content={natsConfig} />
							</TimelineItem>
							<TimelineItem title="Start the server">
								<svelte:fragment slot="icon">
								<span
									class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										2
									</span>
								</svelte:fragment>
								<div class="my-4">
									<p class="mb-3 text-base text-light-base dark:text-dark-base">
										Start your Operator NATS server using the saved config.
									</p>
								</div>
								<CodeBlock loading={false} language={plaintext} content="nats-server -c nats.conf" />
							</TimelineItem>
							<TimelineItem title="Proxy Agent token">
								<svelte:fragment slot="icon">
								<span
									class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										3
									</span>
								</svelte:fragment>
								<div class="my-4">
									<p class="mb-3 text-base text-light-base dark:text-dark-base">
										Generate a new Proxy Agent authorization token. Please note that it cannot be retrieved again later
										and must be regenerated if lost.
									</p>
									{#if proxyToken}
										<CodeBlock loading={false} content={proxyToken} />
									{:else}
										<Button on:click={generateProxyToken} class="min-w-52">
											{#if loadingProxyToken}
												<Spinner size={4} color="gray" />
											{:else}
												<div class="mr-2">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
															 stroke="currentColor" class="size-4">
														<path stroke-linecap="round" stroke-linejoin="round"
																	d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
													</svg>
												</div>
												Generate Proxy Token
											{/if}
										</Button>
									{/if}
								</div>
							</TimelineItem>
							<TimelineItem title="Run the Proxy Agent">
								<svelte:fragment slot="icon">
								<span
									class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										4
									</span>
								</svelte:fragment>
								<div class="my-4">
									<p class="mb-3 text-base text-light-base dark:text-dark-base leading-7">
										The Coro Proxy Agent is a lightweight service that connects your Operator NATS server to Coro.<br>
										You can run the service as a Docker container using the latest Coro Proxy Agent image.
									</p>
									<CodeBlock loading={false} language={plaintext} content={proxyAgentCmd} />
									<Button class="mt-5 min-w-44" on:click={testNATSConnection}>
										{#if loadingTestConnection}
											<Spinner size={4} color="gray" />
										{:else}
											<div class="mr-2">
												<CloudArrowUpOutline size="md" />
											</div>
											Test Connection
										{/if}
									</Button>
								</div>
							</TimelineItem>
						</Timeline>
					{/if}
				</TabCard>
			</div>
			<div slot="3">
				<TabCard>
					<AccountsTable bind:loading bind:openCreateModal={openCreateAccount} bind:hasMore={hasMoreAccounts}
												 bind:loadingMore={loadingMoreAccounts} accounts={accounts}
												 on:loadMore={fetchNextAccountsPage} />
				</TabCard>
			</div>
		</TabGroup>
	{/if}
</main>

<CreateAccountModal bind:accounts bind:open={openCreateAccount} operatorId={operator?.id ?? ''} />
