<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { showError, showSuccess } from '$lib/stores/toast';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Info from '@lucide/svelte/icons/info';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	interface Props {
		deleteCallback: (unmanage?: boolean) => Promise<void>;
		size?: 'default' | 'sm' | 'lg' | 'icon';
		allowUnmanage?: boolean;
		unmanageLabel?: string;
		unmanageTooltip?: string;
		additionalNote?: string;
		requireUnmanageToDelete?: boolean;
	}

	let {
		deleteCallback,
		size = 'default',
		allowUnmanage = false,
		unmanageLabel = 'Unmanage',
		unmanageTooltip,
		additionalNote,
		requireUnmanageToDelete = false,
	}: Props = $props();

	let open = $state(false);
	let loading = $state(false);
	let unmanage = $state(false);

	const deleteDisabled = $derived(loading || (requireUnmanageToDelete && allowUnmanage && !unmanage));

	async function handleDelete() {
		try {
			loading = true;
			await deleteCallback(allowUnmanage ? unmanage : undefined);
			showSuccess(unmanage ? 'Item unmanaged' : 'Item deleted');
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
		{#if additionalNote}
			<div class="bg-yellow-500/10 border-yellow-500/50 border rounded-md p-3 flex gap-2 items-start">
				<AlertTriangle class="size-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
				<p class="text-sm text-yellow-700 dark:text-yellow-400">{additionalNote}</p>
			</div>
		{/if}
		{#if allowUnmanage}
			<div class="flex items-start gap-3 py-4 border-t border-b">
				<input
					type="checkbox"
					id="unmanage-toggle"
					bind:checked={unmanage}
					class="mt-0.5 size-4 rounded border-gray-300 text-primary focus:ring-primary"
				/>
				<div class="flex-1">
					<label for="unmanage-toggle" class="text-sm font-medium cursor-pointer">
						{unmanageLabel}
					</label>
					{#if unmanageTooltip}
						<p class="text-xs text-muted-foreground mt-1">{unmanageTooltip}</p>
					{/if}
				</div>
			</div>
		{/if}
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={loading}>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleDelete} disabled={deleteDisabled} class="min-w-24">
				{#if loading}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					{unmanage ? 'Unmanage' : 'Delete'}
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
