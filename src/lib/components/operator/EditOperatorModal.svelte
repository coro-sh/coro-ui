<script lang="ts">
	import { CoroClient } from '$lib/coro-client';
	import type { OperatorResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import { Heading, Input, Label } from 'flowbite-svelte';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let operator: OperatorResponse;

	let loading = false;
	let name = operator.name;

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			operator = await client.updateOperatorName(operator.id, name);
			open = false;
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="operator" modalType="edit" entityName={operator.name}>
		<Heading tag="h3" class="col-span-2 text-lg font-medium">
			General
		</Heading>
		<div class="col-span-2">
			<Label for="name" class="mb-2">Name</Label>
			<Input bind:value={name} name="name" placeholder="Type operator name" required />
		</div>
	</EntityModal>
</form>
