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
	}: Props = $props();
</script>

<div class="flex items-center justify-between pb-4">
	<h2 class="text-xl font-semibold sm:text-2xl">{`${upperCaseFirstChar(entityType)}s`}</h2>
	<Button onclick={() => (openCreateModal = true)}>
		<Plus class="size-4" />
		{`Create ${upperCaseFirstChar(entityType)}`}
	</Button>
</div>

<div class="overflow-x-auto">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each columns as title}
					<Table.Head class="font-medium whitespace-nowrap">{title}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if loading}
				<Table.Row>
					{#each columns as _}
						<Table.Cell>
							<Skeleton class="h-4 w-24" />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else if isEmpty}
				<Table.Row>
					<Table.Cell colspan={columns.length}>
						<div class="text-muted-foreground my-20 text-center">
							<p class="mb-5">{`No ${upperCaseFirstChar(entityType)}s found`}</p>
							<Button variant="outline" onclick={() => (openCreateModal = true)}>
								<Plus class="size-4" />
								{`Create ${upperCaseFirstChar(entityType)}`}
							</Button>
						</div>
					</Table.Cell>
				</Table.Row>
			{:else if children}
				{@render children()}
			{/if}
			{#if hasMore}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="pt-10">
						<div class="flex justify-center">
							<Button variant="outline" onclick={onloadmore} disabled={loadingMore}>
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
