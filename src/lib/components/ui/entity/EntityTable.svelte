<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import { upperCaseFirstChar } from '$lib/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { Snippet } from 'svelte';

	interface Props {
		loading?: boolean;
		entityType: 'operator' | 'account' | 'user';
		columns: string[];
		openCreateModal?: boolean;
		isEmpty: boolean;
		hasMore?: boolean;
		loadingMore?: boolean;
		onloadmore?: () => void;
		children?: Snippet;
		hideCreateButton?: boolean;
		disabled?: boolean;
	}

	let {
		loading = $bindable(true),
		entityType,
		columns,
		openCreateModal = $bindable(false),
		isEmpty,
		hasMore = $bindable(false),
		loadingMore = $bindable(false),
		onloadmore,
		children,
		hideCreateButton = false,
		disabled = false,
	}: Props = $props();
</script>

<div class="flex items-center justify-between pb-6">
	<h2 class="text-2xl font-semibold tracking-tight">{`${upperCaseFirstChar(entityType)}s`}</h2>
	{#if !hideCreateButton}
		<Button onclick={() => (openCreateModal = true)} {disabled}>
			<Plus class="size-4" />
			{`Create ${upperCaseFirstChar(entityType)}`}
		</Button>
	{/if}
</div>

<div class="border-border overflow-hidden rounded-lg border">
	<div class="max-h-[580px] overflow-x-auto overflow-y-auto">
		<Table.Root>
			<Table.Header class="bg-muted/50 sticky top-0 z-10 border-b">
				<Table.Row class="hover:bg-transparent">
					{#each columns as title}
						<Table.Head class="text-muted-foreground h-12 px-4 text-xs font-semibold uppercase tracking-wider">
							{title}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
		<Table.Body>
			{#if loading}
				{#each { length: 5 } as _}
					<Table.Row class="hover:bg-transparent [&>td]:h-16 [&>td]:px-4">
						{#each columns as _}
							<Table.Cell>
								<Skeleton class="h-4 w-32" />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{:else if isEmpty}
				<Table.Row class="hover:bg-transparent">
					<Table.Cell colspan={columns.length}>
						<div class="text-muted-foreground py-24 text-center">
							{#if disabled}
								<p class="text-base">
									NATS server not connected. Connect your Operator's NATS server to view {entityType}s.
								</p>
							{:else}
								<p class="mb-6 text-base font-medium">{`No ${upperCaseFirstChar(entityType)}s found`}</p>
								{#if !hideCreateButton}
									<Button variant="outline" onclick={() => (openCreateModal = true)}>
										<Plus class="size-4" />
										{`Create ${upperCaseFirstChar(entityType)}`}
									</Button>
								{/if}
							{/if}
						</div>
					</Table.Cell>
				</Table.Row>
			{:else if children}
				{@render children()}
			{/if}
			{#if hasMore}
				<Table.Row class="hover:bg-transparent border-0">
					<Table.Cell colspan={columns.length} class="px-4 py-6">
						<div class="flex justify-center">
							<Button variant="outline" size="sm" onclick={onloadmore} disabled={loadingMore}>
								{#if loadingMore}
									<LoaderCircle class="size-4 animate-spin" />
								{:else}
									Load More
								{/if}
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
	</div>
</div>
