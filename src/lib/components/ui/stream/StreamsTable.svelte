<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { type Stream } from '$lib/models/entity';
	import EntityTableRow from '$lib/components/ui/entity/EntityTableRow.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { formatEpoch } from '$lib/utils';

	interface Props {
		loading?: boolean;
		streams: Stream[];
		accountId: string;
		operatorId: string;
		disabled?: boolean;
	}

	let {
		loading = $bindable(false),
		streams,
		accountId,
		operatorId,
		disabled = false,
	}: Props = $props();

	const columns = ['Name', 'Subjects', 'Messages', 'Consumers', 'Created'];
</script>

<div class="flex items-center justify-between pb-6">
	<h2 class="text-2xl font-semibold tracking-tight">Streams</h2>
</div>

<div class="border-border overflow-hidden rounded-lg border">
	<div class="max-h-[580px] overflow-x-auto overflow-y-auto">
		<Table.Root>
			<Table.Header class="bg-muted/50 sticky top-0 z-10 border-b">
				<Table.Row class="hover:bg-transparent">
					{#each columns as title}
						<Table.Head class="text-muted-foreground h-12 px-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{title}</Table.Head>
					{/each}
					<Table.Head class="w-16"></Table.Head>
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
						<Table.Cell></Table.Cell>
					</Table.Row>
				{/each}
			{:else if streams.length === 0}
				<Table.Row class="hover:bg-transparent">
					<Table.Cell colspan={columns.length + 1}>
						<div class="text-muted-foreground py-24 text-center">
							{#if disabled}
								<p class="text-base">NATS server not connected. Connect your Operator's NATS server to view streams.</p>
							{:else}
								<p class="text-base font-medium">No streams found</p>
							{/if}
						</div>
					</Table.Cell>
				</Table.Row>
			{:else}
				{#each streams as stream, i (stream?.name || i)}
					{#if stream && stream.name}
						<EntityTableRow
							href={disabled
								? undefined
								: `/namespaces/${namespaceStore.activeId}/operators/${operatorId}/${accountId}/streams/${encodeURIComponent(stream.name)}`}
							bottomBorder={i < streams.length - 1}
							{disabled}
						>
							<Table.Cell>{stream.name}</Table.Cell>
							<Table.Cell>{stream.subjects?.join(', ') || '-'}</Table.Cell>
							<Table.Cell>{stream.message_count.toLocaleString()}</Table.Cell>
							<Table.Cell>{stream.consumer_count}</Table.Cell>
							<Table.Cell>{formatEpoch(stream.create_time)}</Table.Cell>
						</EntityTableRow>
					{/if}
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
	</div>
</div>
