<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { type AccountResponse } from '$lib/models/entity';
	import EntityTable from '$lib/components/ui/entity/EntityTable.svelte';
	import EntityTableRow from '$lib/components/ui/entity/EntityTableRow.svelte';
	import CopyableText from '$lib/components/ui/text/CopyableText.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

	interface Props {
		loading?: boolean;
		openCreateModal?: boolean;
		accounts: AccountResponse[];
		hasMore?: boolean;
		loadingMore?: boolean;
		onloadmore?: () => void;
	}

	let {
		loading = $bindable(true),
		openCreateModal = $bindable(false),
		accounts,
		hasMore = $bindable(false),
		loadingMore = $bindable(false),
		onloadmore,
	}: Props = $props();

	const columns = ['ID', 'Name', 'Public Key', ''];
</script>

<EntityTable
	bind:loading
	bind:openCreateModal
	bind:hasMore
	bind:loadingMore
	entityType="account"
	{columns}
	isEmpty={accounts.length === 0}
	{onloadmore}
>
	{#each accounts as acc, i (acc.id)}
		<EntityTableRow
			href={`/namespaces/${namespaceStore.activeId}/operators/${acc.operator_id}/${acc.id}`}
			bottomBorder={i < accounts.length - 1}
		>
			<Table.Cell>
				<CopyableText spanId={`account-id-${acc.id}`} text={acc.id ?? ''} />
			</Table.Cell>
			<Table.Cell>{acc.name}</Table.Cell>
			<Table.Cell>
				<CopyableText spanId={`account-pk-${acc.id}`} text={acc.public_key ?? ''} />
			</Table.Cell>
		</EntityTableRow>
	{/each}
</EntityTable>
