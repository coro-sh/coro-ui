<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { type UserResponse } from '$lib/models/entity';
	import EntityTable from '$lib/components/ui/entity/EntityTable.svelte';
	import EntityTableRow from '$lib/components/ui/entity/EntityTableRow.svelte';
	import CopyableText from '$lib/components/ui/text/CopyableText.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

	interface Props {
		loading?: boolean;
		openCreateModal?: boolean;
		users: UserResponse[];
		hasMore?: boolean;
		loadingMore?: boolean;
		onloadmore?: () => void;
	}

	let {
		loading = $bindable(true),
		openCreateModal = $bindable(false),
		users,
		hasMore = $bindable(false),
		loadingMore = $bindable(false),
		onloadmore
	}: Props = $props();

	const columns = ['ID', 'Name', 'Public Key', ''];
</script>

<EntityTable
	bind:loading
	bind:openCreateModal
	bind:hasMore
	bind:loadingMore
	entityType="user"
	{columns}
	isEmpty={users.length === 0}
	{onloadmore}
>
	{#each users as user, i (user.id)}
		<EntityTableRow
			href={`/namespaces/${namespaceStore.activeId}/operators/${user.operator_id}/${user.account_id}/${user.id}`}
			bottomBorder={i < users.length - 1}
		>
			<Table.Cell>
				<CopyableText spanId={`user-id-${user.id}`} text={user.id ?? ''} />
			</Table.Cell>
			<Table.Cell>{user.name}</Table.Cell>
			<Table.Cell>
				<CopyableText spanId={`user-pk-${user.id}`} text={user.public_key ?? ''} />
			</Table.Cell>
		</EntityTableRow>
	{/each}
</EntityTable>
