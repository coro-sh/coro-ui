<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { showError, showSuccess } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
		namespaceId: string;
		namespaceName: string;
	}

	let { open = $bindable(false), namespaceId, namespaceName }: Props = $props();

	let loading = $state(false);
	let name = $state('');

	const client = new CoroClient();

	// Initialize name when modal opens
	$effect(() => {
		if (open) {
			name = namespaceName;
		}
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			await client.updateNamespace(namespaceId, name);

			// Refresh namespace list to get updated name
			const paginator = client.paginateNamespaces(100);
			const page = await paginator.fetchNext();
			namespaceStore.setNamespaces(page);

			showSuccess('Namespace updated');
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
	entityType="namespace"
	modalType="edit"
	entityName={namespaceName}
	onsubmit={handleSubmit}
>
	<div class="col-span-2 space-y-2">
		<Label for="name">Name</Label>
		<Input bind:value={name} id="name" name="name" placeholder="Type namespace name" required />
	</div>
</EntityModal>
