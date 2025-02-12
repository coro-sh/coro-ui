<script lang="ts">
	import { Button, Heading, TabItem, Tabs, Timeline, TimelineItem } from 'flowbite-svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import { DownloadSolid } from 'flowbite-svelte-icons';
	import CodeBlock from '$lib/components/text/CodeBlock.svelte';
	import { CoroClient } from '$lib/coro-client.js';
	import UserIssuancesTable from '$lib/components/user/UserIssuancesTable.svelte';
	import { getConnectedSnippets } from '$lib/components/user/get-connected-snippets';
	import { plaintext } from 'svelte-highlight/languages';

	export let userId: string;
	export let issuancesComponent: UserIssuancesTable;

	$: loading = !userId;

	const client = new CoroClient();

	async function handleDownloadCreds() {
		await client.downloadUserCreds(userId);
		await issuancesComponent.handleNewIssuance();
	}
</script>

<Heading tag="h2"
				 class="mb-6 text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full">
	Get connected
</Heading>
<div class="ml-1.5">
	<Timeline order="vertical">
		<TimelineItem title="Download credentials file">
			<svelte:fragment slot="icon">
									<span
										class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										1
									</span>
			</svelte:fragment>
			<div class="mt-4">
				{#if loading}
					<PlaceholderLine width="3/12" />
				{:else}
					<Button color="alternative" on:click={handleDownloadCreds} class="px-4">
						<DownloadSolid class="mr-2" size="sm" />
						Download credentials
					</Button>
				{/if}
			</div>
		</TimelineItem>
		<TimelineItem title="Connect to the Operator NATS server">
			<svelte:fragment slot="icon">
								<span
									class="flex absolute -start-3.5 justify-center items-center w-7 h-7 rounded-full ring-8 ring-white dark:ring-dark-content bg-mono-200 dark:bg-mono-700 font-medium">
										2
									</span>
			</svelte:fragment>
			<div class="mt-4">
				<p class="mb-3 text-base text-light-base dark:text-dark-base">Using the NATS CLI tool:</p>
				<CodeBlock loading={false}
									 language={plaintext}
									 content='nats -s nats://<HOST>:<PORT> --creds <PATH_TO_CREDS> sub ">"' />
			</div>
			<div class="mt-4">
				<p class="mb-3 text-base text-light-base dark:text-dark-base">Using a client library:</p>

				<Tabs tabStyle="underline"
							contentClass='p-0 bg-white dark:bg-dark-content border-none dark:border-dark-border shadow-sm rounded-lg mt-4'
				>
					<hr slot="divider" class="border-t border-light-border dark:border-dark-border mb-4" />
					{#each getConnectedSnippets as snippet, i}
						<TabItem open={i === 0}>
							<p slot='title' class="text-sm text-light-alt dark:text-dark-alt">{snippet.name}</p>
							<CodeBlock loading={false} language={snippet.language} content={snippet.codeBlock} />
						</TabItem>
					{/each}
				</Tabs>
			</div>
		</TimelineItem>
	</Timeline>
</div>
