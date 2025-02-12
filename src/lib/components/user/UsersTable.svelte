<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import { type UserResponse } from '$lib/models/entity';
	import EntityTable from '$lib/components/entity/EntityTable.svelte';
	import { createEventDispatcher } from 'svelte';
	import CopyableText from '$lib/components/text/CopyableText.svelte';
	import EntityTableRow from '$lib/components/entity/EntityTableRow.svelte';
	import {activeNamespaceId} from '$lib/stores/namespace';

	export let loading = true;
	export let openCreateModal: boolean;
	export let users: UserResponse[];
	export let hasMore: boolean;
	export let loadingMore: boolean;

	const columns = ['ID', 'Name', 'Public Key', ''];

	const dispatch = createEventDispatcher();
</script>

<EntityTable bind:loading
						 bind:openCreateModal
						 bind:hasMore
						 bind:loadingMore
						 entityType="user"
						 columns={columns}
						 isEmpty={users.length === 0}
						 on:loadMore={() => {	dispatch('loadMore')}}
>
	{#each users as user, i (user.id)}
		<EntityTableRow href={`/namespaces/${$activeNamespaceId}/operators/${user.operator_id}/${user.account_id}/${user.id}`}
										bottomBorder={i < users.length - 1}>
			{#each [user.id, user.name, user.public_key] as val}
				<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
					{#if [user.id, user.public_key].includes(val)}
						<CopyableText spanId={`user-${val}`} text={val ?? ''} />
					{:else}
						{val}
					{/if}
				</TableBodyCell>
			{/each}
		</EntityTableRow>
	{/each}
</EntityTable>
