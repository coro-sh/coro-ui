<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { type Stream } from '$lib/models/entity';
	import EntityTableRow from '$lib/components/ui/entity/EntityTableRow.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

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

<div class="flex items-center justify-between pb-4">
	<h2 class="text-xl font-semibold sm:text-2xl">Streams</h2>
</div>

<div class="overflow-x-auto">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each columns as title}
					<Table.Head class="font-medium whitespace-nowrap">{title}</Table.Head>
				{/each}
				<Table.Head class="w-16"></Table.Head>
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
					<Table.Cell></Table.Cell>
				</Table.Row>
			{:else if streams.length === 0}
				<Table.Row>
					<Table.Cell colspan={columns.length + 1}>
						<div class="text-muted-foreground my-20 text-center">
							{#if disabled}
								<p>NATS server not connected. Connect your Operator's NATS server to view streams.</p>
							{:else}
								<p>No streams found</p>
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
							<Table.Cell>{new Date(stream.create_time * 1000).toLocaleDateString()}</Table.Cell>
						</EntityTableRow>
					{/if}
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
