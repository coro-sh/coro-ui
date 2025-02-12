<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import { type AccountResponse } from '$lib/models/entity';
	import EntityTable from '$lib/components/entity/EntityTable.svelte';
	import { createEventDispatcher } from 'svelte';
	import CopyableText from '$lib/components/text/CopyableText.svelte';
	import EntityTableRow from '$lib/components/entity/EntityTableRow.svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';

	export let loading = true;
	export let openCreateModal: boolean;
	export let accounts: AccountResponse[];
	export let hasMore: boolean;
	export let loadingMore: boolean;

	const columns = ['ID', 'Name', 'Public Key', ''];

	const dispatch = createEventDispatcher();
</script>

<EntityTable
	bind:loading
	bind:openCreateModal
	bind:hasMore
	bind:loadingMore
	entityType="account"
	columns={columns}
	isEmpty={accounts.length === 0}
	on:loadMore={() => dispatch('loadMore')}
>
	{#each accounts as acc, i (acc.id)}
		<EntityTableRow href={`/namespaces/${$activeNamespaceId}/operators/${acc.operator_id}/${acc.id}`}
										bottomBorder={i < accounts.length - 1}>
			{#each [acc.id, acc.name, acc.public_key] as val}
				<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
					{#if [acc.id, acc.public_key].includes(val)}
						<CopyableText spanId={`account-${val}`} text={val ?? ''} />
					{:else}
						{val}
					{/if}
				</TableBodyCell>
			{/each}
		</EntityTableRow>
	{/each}
</EntityTable>
