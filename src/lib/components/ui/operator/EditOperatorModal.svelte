<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
		operator: OperatorResponse;
	}

	let { open = $bindable(false), operator = $bindable() }: Props = $props();

	let loading = $state(false);
	let name = $state(operator.name);

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			operator = await client.updateOperatorName(operator.id, name);
			open = false;
		} catch (e) {
			showError(e as Error);
		} finally {
			loading = false;
		}
	}
</script>

<EntityModal
	bind:open
	bind:loading
	entityType="operator"
	modalType="edit"
	entityName={operator.name}
	onsubmit={handleSubmit}
>
	<h3 class="col-span-2 text-lg font-medium">General</h3>
	<div class="col-span-2">
		<Label for="name" class="mb-2">Name</Label>
		<Input bind:value={name} name="name" placeholder="Type operator name" required />
	</div>
</EntityModal>
