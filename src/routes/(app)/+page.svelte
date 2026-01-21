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

<svelte:head>
	<title>Dashboard - Coro</title>
</svelte:head>

{#if !namespaceStore.namespaces.length}
	<div class="flex h-96 items-center justify-center">
		<Card.Root class="w-full max-w-2xl">
			<Card.Content class="pt-6">
				<div class="mb-3 flex items-center justify-center">
					<FolderOpen class="text-muted-foreground size-12" />
				</div>
				<div class="text-muted-foreground text-center">
					<p class="text-foreground mb-2 text-2xl font-medium">No Namespaces found</p>
					<p class="mb-5 text-base">Get started by creating a new Namespace</p>
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
