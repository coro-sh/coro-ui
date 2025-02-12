<script lang="ts">import { Button, Modal, Spinner } from 'flowbite-svelte';
import { showErrorToast, showSuccessToast } from '$lib/stores/toast';
import { TrashBinOutline } from 'flowbite-svelte-icons';

export let deleteCallback: () => Promise<void>;
export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
let open = false;
let callbackLoading = false;

async function handleDeleteClicked() {
	try {
		callbackLoading = true;
		await deleteCallback();
		showSuccessToast('Item deleted');
	} catch (e) {
		showErrorToast(e);
	} finally {
		callbackLoading = false;
		open = false;
	}
}
</script>

<Button size={size} color="none" class="px-4 bg-red-700 dark:bg-red-750 text-red-100" on:click={() => {
		open = true;
	}}>
	<TrashBinOutline class="mr-1 w-5 h-5" />
	Delete
</Button>

<Modal bind:open color="none"
			 title=""
			 size={size}
			 autoclose={false}
			 dismissable={false}
			 outsideclose
			 class="m-4"
			 classBackdrop="bg-mono-500 dark:bg-mono-900"
			 classBody="bg-light-content dark:bg-dark-content border-none rounded-lg"
			 classHeader="bg-light-content dark:bg-dark-content border-b border-light-border dark:border-dark-border"
			 classFooter="bg-light-content dark:bg-dark-content border-b border-light-border dark:border-dark-border">

	<svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor"
			 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd"
					d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
					clip-rule="evenodd" />
	</svg>
	<p class="mb-4 text-gray-500 dark:text-gray-300 text-center">Are you sure you want to delete this item?</p>
	<div class="flex justify-center items-center space-x-4">
		<Button color="alternative" disabled={callbackLoading} on:click={() => {open = false}}>No, cancel</Button>
		<Button color="red" class="min-w-32" on:click={handleDeleteClicked}>
			{#if callbackLoading}
				<Spinner size={4} color="gray" />
			{:else}
				Yes, I'm sure
			{/if}
		</Button>
	</div>
</Modal>
