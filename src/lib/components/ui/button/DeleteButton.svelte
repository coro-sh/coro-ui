<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { showError, showSuccess } from '$lib/stores/toast';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		deleteCallback: () => Promise<void>;
		size?: 'default' | 'sm' | 'lg' | 'icon';
	}

	let { deleteCallback, size = 'default' }: Props = $props();

	let open = $state(false);
	let loading = $state(false);

	async function handleDelete() {
		try {
			loading = true;
			await deleteCallback();
			showSuccess('Item deleted');
			open = false;
		} catch (e) {
			showError(e as Error);
		} finally {
			loading = false;
		}
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="destructive" {size}>
				<Trash2 class="size-4" />
				Delete
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this item.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={loading}>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleDelete} disabled={loading} class="min-w-24">
				{#if loading}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					Delete
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
