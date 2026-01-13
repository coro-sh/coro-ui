<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Tabs from '$lib/components/ui/tabs';
	import CodeBlock from '$lib/components/ui/text/CodeBlock.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { getConnectedSnippets } from '$lib/components/ui/user/get-connected-snippets';
	import type { UserIssuancesTableApi } from '$lib/components/ui/user/UserIssuancesTable.svelte';
	import Download from '@lucide/svelte/icons/download';

	interface Props {
		userId?: string;
		issuancesApi?: UserIssuancesTableApi;
	}

	let { userId, issuancesApi }: Props = $props();

	const loading = $derived(!userId);
	const client = new CoroClient();

	async function handleDownloadCreds() {
		if (!userId) return;
		await client.downloadUserCreds(userId);
		await issuancesApi?.handleNewIssuance();
	}
</script>

<h2 class="mb-6 text-xl font-semibold sm:text-2xl">Get connected</h2>

<div class="space-y-8">
	<!-- Step 1 -->
	<div class="flex gap-4">
		<div class="flex flex-col items-center">
			<div
				class="bg-muted flex size-8 items-center justify-center rounded-full text-sm font-medium"
			>
				1
			</div>
			<div class="bg-border mt-2 h-full w-px"></div>
		</div>
		<div class="min-w-0 flex-1 pb-4">
			<h3 class="mb-2 font-semibold">Download credentials file</h3>
			<div class="mt-4">
				{#if loading}
					<Skeleton class="h-9 w-48" />
				{:else}
					<Button variant="outline" onclick={handleDownloadCreds}>
						<Download class="size-4" />
						Download credentials
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Step 2 -->
	<div class="flex gap-4">
		<div class="flex flex-col items-center">
			<div
				class="bg-muted flex size-8 items-center justify-center rounded-full text-sm font-medium"
			>
				2
			</div>
		</div>
		<div class="min-w-0 flex-1">
			<h3 class="mb-2 font-semibold">Connect to the Operator NATS server</h3>

			<div class="mt-4">
				<p class="text-muted-foreground mb-3 text-sm">Using the NATS CLI tool:</p>
				<CodeBlock content="nats -s nats://<HOST>:<PORT> --creds <PATH_TO_CREDS> sub '>'" />
			</div>

			<div class="mt-6">
				<p class="text-muted-foreground mb-3 text-sm">Using a client library:</p>

				<Tabs.Root value={getConnectedSnippets[0].name}>
					<Tabs.List>
						{#each getConnectedSnippets as snippet (snippet.name)}
							<Tabs.Trigger value={snippet.name}>{snippet.name}</Tabs.Trigger>
						{/each}
					</Tabs.List>
					{#each getConnectedSnippets as snippet (snippet.name)}
						<Tabs.Content value={snippet.name} class="mt-4">
							<CodeBlock content={snippet.codeBlock} language={snippet.language} />
						</Tabs.Content>
					{/each}
				</Tabs.Root>
			</div>
		</div>
	</div>
</div>
