<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { activeNamespaceId, namespaces } from '$lib/stores/namespace';
	import { goto } from '$app/navigation';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;

	let loading = false;
	let name = '';

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			const created = await client.createNamespace(name);
			const paginator = client.paginateNamespaces(100);
			const page = await paginator.fetchNext();
			namespaces.set(page);
			activeNamespaceId.set(created.id);
			name = '';
			open = false;
			const url = `/namespaces/${$activeNamespaceId}`;
			await goto(url);
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="namespace" modalType="create">
		<div class="col-span-2">
			<Label class="space-y-2">
				<span>Name</span>
				<Input bind:value={name} name="name" placeholder="Type namespace name" required />
			</Label>
		</div>
	</EntityModal>
</form>
