<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import CreateNamespaceModal from '$lib/components/ui/namespace/CreateNamespaceModal.svelte';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import Plus from '@lucide/svelte/icons/plus';

	let openCreateNamespaceModal = $state(false);

	onMount(() => {
		if (namespaceStore.activeId) {
			goto(`/namespaces/${namespaceStore.activeId}/operators`);
		} else if (namespaceStore.namespaces.length) {
			const defaultNS = namespaceStore.namespaces.find((item) => item.name === 'default');
			const targetId = defaultNS?.id ?? namespaceStore.namespaces[0].id;
			namespaceStore.setActiveId(targetId);
			goto(`/namespaces/${targetId}/operators`);
		}
	});
</script>

{#if !namespaceStore.namespaces.length}
	<div class="flex items-center justify-center h-96">
		<Card.Root class="w-full max-w-2xl">
			<Card.Content class="pt-6">
				<div class="flex items-center justify-center mb-3">
					<FolderOpen class="text-muted-foreground size-12" />
				</div>
				<div class="text-center text-muted-foreground">
					<p class="text-2xl font-medium mb-2 text-foreground">No Namespaces found</p>
					<p class="text-base mb-5">Get started by creating a new Namespace</p>
					<Button variant="outline" onclick={() => (openCreateNamespaceModal = true)}>
						<Plus class="size-4" />
						Create Namespace
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}

<CreateNamespaceModal bind:open={openCreateNamespaceModal} />
