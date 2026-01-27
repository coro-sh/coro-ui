<script lang="ts">
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/ui/entity/EntityOverview.svelte';
	import EditOperatorModal from '$lib/components/ui/operator/EditOperatorModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';

	interface Props {
		operator: OperatorResponse;
		loading?: boolean;
	}

	let { operator = $bindable(), loading = $bindable(true) }: Props = $props();

	let openEditModal = $state(false);

	const copyableFields = ['ID', 'Public Key'];
	const operatorFields = ['NATS Status', 'ID', 'Public Key'] as const;

	const operatorData = $derived.by(() => {
		const data = new Map<(typeof operatorFields)[number], unknown>();
		if (operator) {
			data.set('NATS Status', operator.status.connected ? 'Connected' : 'Disconnected');
			data.set('ID', operator.id);
			data.set('Public Key', operator.public_key);
		} else {
			for (const field of operatorFields) {
				data.set(field, 'Unknown');
			}
		}
		return data;
	});

	async function deleteCallback(unmanage?: boolean) {
		await new CoroClient().deleteOperator(operator.id, unmanage);
		await goto('/');
	}
</script>

<EntityOverview
	bind:loading
	editable={true}
	bind:openEditModal
	name={operator?.name}
	{copyableFields}
	data={operatorData}
	jwt={operator?.jwt}
	{deleteCallback}
	allowUnmanage={true}
	unmanageLabel="Unmanage Accounts"
	unmanageTooltip="Unmanage all accounts belonging to this operator. This removes the accounts from Coro but does not delete any resources in NATS."
	additionalNote="All accounts belonging to this operator must first be deleted, or you can use the unmanage option below to remove them from Coro without deleting NATS resources."
/>

{#if operator}
	<EditOperatorModal bind:open={openEditModal} bind:operator />
{/if}
