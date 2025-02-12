<script lang="ts">
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/entity/EntityOverview.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';
	import EditOperatorModal from '$lib/components/operator/EditOperatorModal.svelte';

	export let operator: OperatorResponse;
	export let loading = true;

	let openEditModal = false;

	const copyableFields = ['ID', 'Public Key'];
	const operatorFields = ['NATS Status', 'ID', 'Public Key'] as const;
	const operatorData: Map<typeof operatorFields[number], any> = new Map();

	for (const field of operatorFields) {
		operatorData.set(field, 'Unknown');
	}

	$: if (operator) {
		operatorData.set('NATS Status', operator.status.connected ? 'Connected' : 'Disconnected');
		operatorData.set('ID', operator.id);
		operatorData.set('Public Key', operator.public_key);
	}

	async function deleteCallback() {
		await new CoroClient().deleteOperator(operator.id);
		await goto('/');
	}
</script>

<EntityOverview bind:loading editable={true} bind:openEditModal name={operator?.name} copyableFields={copyableFields}
								data={operatorData}
								jwt={operator?.jwt} deleteCallback={deleteCallback} />

{#if operator}
	<EditOperatorModal bind:open={openEditModal} bind:operator />
{/if}
