<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
		operators?: OperatorResponse[];
	}

	let { open = $bindable(false), operators = $bindable([]) }: Props = $props();

	let loading = $state(false);
	let name = $state('');

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			const created = await client.createOperator(name);
			operators = [created, ...operators];
			name = '';
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
	modalType="create"
	onsubmit={handleSubmit}
>
	<div class="col-span-2">
		<Label for="name" class="mb-2">Name</Label>
		<Input bind:value={name} name="name" placeholder="Type operator name" required />
	</div>
</EntityModal>
