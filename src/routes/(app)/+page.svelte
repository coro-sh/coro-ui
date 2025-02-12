<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { activeNamespaceId, namespaces } from '$lib/stores/namespace';
	import { FolderOpenSolid, PlusOutline } from 'flowbite-svelte-icons';
	import { Button, Card } from 'flowbite-svelte';
	import CreateNamespaceModal from '$lib/components/namespace/CreateNamespaceModal.svelte';

	let openCreateNamespaceModal = false;

	onMount(() => {
		if ($activeNamespaceId) {
			goto(`/namespaces/${$activeNamespaceId}/operators`);
		} else if ($namespaces.length) {
			activeNamespaceId.set($namespaces.find(item => item.name === 'default')?.id ?? $namespaces[0].id);
			goto(`/namespaces/${$activeNamespaceId}/operators`);
		}
	});
</script>

{#if !$namespaces.length}
	<div class="flex items-center justify-center h-96">
		<Card class="w-full max-w-2xl shadow-none dark:bg-dark-content border-light-border dark:border-dark-border">
			<div class="m-5">
				<div class="flex items-center justify-center mb-3">
					<FolderOpenSolid class="text-mono-600 dark:text-mono-400 size-12" />
				</div>
				<div class="text-center text-light-alt dark:text-dark-alt">
					<p class="text-2xl font-medium mb-2">No Namespaces found</p>
					<p class="text-base mb-5">Get started by creating a new Namespace</p>
					<Button color="alternative"
									size="md"
									class="gap-2 whitespace-nowrap px-3"
									on:click={() => {openCreateNamespaceModal = true;}}>
						<PlusOutline size="md" />
						Create Namespace
					</Button>
				</div>
			</div>
		</Card>
	</div>
{/if}

<CreateNamespaceModal bind:open={openCreateNamespaceModal} />
