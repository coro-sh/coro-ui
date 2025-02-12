<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let operators: OperatorResponse[];

	let loading = false;
	let name = '';

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
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="operator" modalType="create">
		<div class="col-span-2">
			<Label class="space-y-2">
				<span>Name</span>
				<Input bind:value={name} name="name" placeholder="Type operator name" required />
			</Label>
		</div>
	</EntityModal>
</form>
