<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { goto } from '$app/navigation';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	let loading = $state(false);
	let name = $state('');

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			const created = await client.createNamespace(name);
			const paginator = client.paginateNamespaces(100);
			const page = await paginator.fetchNext();
			namespaceStore.setNamespaces(page);
			namespaceStore.setActiveId(created.id);
			name = '';
			open = false;
			await goto(`/namespaces/${created.id}`);
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
	entityType="namespace"
	modalType="create"
	onsubmit={handleSubmit}
>
	<div class="col-span-2 space-y-2">
		<Label for="name">Name</Label>
		<Input bind:value={name} id="name" name="name" placeholder="Type namespace name" required />
	</div>
</EntityModal>
