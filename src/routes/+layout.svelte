<script lang="ts">
	import './layout.css';
	import 'svelte-highlight/styles/github-dark.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import ThemeToggle from '$lib/components/ui/theme/ThemeToggle.svelte';
	import CreateNamespaceModal from '$lib/components/ui/namespace/CreateNamespaceModal.svelte';
	import EditNamespaceModal from '$lib/components/ui/namespace/EditNamespaceModal.svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { showError, showSuccess } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { CoroClient } from '$lib/coro-client';
	import type { Snippet } from 'svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import Plus from '@lucide/svelte/icons/plus';
	import Check from '@lucide/svelte/icons/check';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import LogOut from '@lucide/svelte/icons/log-out';
	import User from '@lucide/svelte/icons/user';
	import { IS_CLOUD } from '$lib/config/build-target';
	import { cloudClient } from '$lib/cloud-client';
	import { authStore } from '$lib/stores/auth.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Footer from '$lib/components/ui/footer/Footer.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let windowWidth = $state(0);

	const mxClass = $derived(
		windowWidth >= 2200
			? 'lg:mx-[10%] xl:mx-[8%] 2xl:mx-[14%] !mx-[22%]'
			: 'lg:mx-[10%] xl:mx-[8%] 2xl:mx-[14%]'
	);

	$effect(() => {
		if (typeof window !== 'undefined') {
			windowWidth = window.innerWidth;
			const handleResize = () => {
				windowWidth = window.innerWidth;
			};
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});

	let dropdownOpen = $state(false);
	let openCreateNamespaceModal = $state(false);
	let openEditNamespaceModal = $state(false);
	let editNamespaceId = $state('');
	let editNamespaceName = $state('');
	let deleteNamespaceLoading = $state(false);

	const logoImage = $derived(mode.current === 'dark' ? 'logo-dark.svg' : 'logo-light.svg');
	const activeNamespaceName = $derived(
		namespaceStore.activeId
			? namespaceStore.getNamespaceName(namespaceStore.activeId)
			: 'Select namespace'
	);

	function updateActiveNamespace(selectedId: string) {
		dropdownOpen = false;
		if (selectedId === namespaceStore.activeId) {
			return;
		}
		namespaceStore.setActiveId(selectedId);
		goto(`/namespaces/${selectedId}`);
	}

	function editNamespace(namespaceId: string, namespaceName: string) {
		editNamespaceId = namespaceId;
		editNamespaceName = namespaceName;
		openEditNamespaceModal = true;
	}

	async function deleteNamespace(namespaceId: string) {
		try {
			deleteNamespaceLoading = true;
			await new CoroClient().deleteNamespace(namespaceId);
			showSuccess('Namespace deleted');

			const updatedNamespaces = namespaceStore.namespaces.filter((item) => item.id !== namespaceId);
			namespaceStore.setNamespaces(updatedNamespaces);

			if (updatedNamespaces.length === 0) {
				namespaceStore.setActiveId(undefined);
				await goto('/');
			} else if (namespaceStore.activeId === namespaceId) {
				const defaultNS = updatedNamespaces.find((item) => item.name === 'default');
				const newActiveId = defaultNS?.id ?? updatedNamespaces[0].id;
				namespaceStore.setActiveId(newActiveId);
				await goto(`/namespaces/${newActiveId}`);
			}
		} catch (e) {
			showError(e as Error);
		} finally {
			deleteNamespaceLoading = false;
		}
	}
</script>

<ModeWatcher defaultMode="dark" />

<header class="bg-background fixed top-0 z-40 mx-auto w-full flex-none border-b">
	<div class={mxClass}>
		<nav class="flex h-14 items-center justify-between px-4">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<a href="/" class="flex cursor-pointer items-center">
						<img src="/images/{logoImage}" class="h-6" alt="coro logo" />
					</a>
					{#if IS_CLOUD}
						<Badge variant="outline" class="text-xs">BETA</Badge>
					{/if}
				</div>

				{#if namespaceStore.namespaces.length}
					<DropdownMenu.Root bind:open={dropdownOpen}>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" size="sm" class="min-w-36 justify-between">
									{#if namespaceStore.loading}
										<LoaderCircle class="size-4 animate-spin" />
									{:else}
										{activeNamespaceName}
										{#if dropdownOpen}
											<ChevronUp class="size-4" />
										{:else}
											<ChevronDown class="size-4" />
										{/if}
									{/if}
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56">
							<DropdownMenu.Item onclick={() => (openCreateNamespaceModal = true)}>
								<Plus class="size-4" />
								Create Namespace
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							{#each namespaceStore.namespaces as namespace (namespace.id)}
								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger onclick={() => updateActiveNamespace(namespace.id)}>
										{#if namespaceStore.activeId === namespace.id}
											<Check class="size-4" />
										{/if}
										<span class="truncate">{namespace.name}</span>
									</DropdownMenu.SubTrigger>
									<DropdownMenu.SubContent>
										<DropdownMenu.Item onclick={() => editNamespace(namespace.id, namespace.name)}>
											<Pencil class="size-4" />
											Edit Namespace
										</DropdownMenu.Item>
										<DropdownMenu.Item
											class="text-destructive focus:text-destructive"
											disabled={deleteNamespaceLoading}
											onclick={() => deleteNamespace(namespace.id)}
										>
											{#if deleteNamespaceLoading}
												<LoaderCircle class="size-4 animate-spin" />
											{:else}
												<Trash2 class="size-4" />
											{/if}
											Delete Namespace
										</DropdownMenu.Item>
									</DropdownMenu.SubContent>
								</DropdownMenu.Sub>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<ThemeToggle />
				{#if IS_CLOUD && authStore.user}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="ghost" size="icon" aria-label="Profile menu">
									<User class="size-5" />
								</Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-48">
							<DropdownMenu.Item onclick={() => goto('/profile')}>
								<User class="size-4" />
								Profile
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={() => cloudClient.logout()}>
								<LogOut class="size-4" />
								Sign out
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</div>
		</nav>
	</div>
</header>

<Tooltip.Provider>
	<div class="overflow-hidden lg:flex">
		<div
			class="relative h-full w-full overflow-y-auto pt-[70px] {mxClass} mt-4 mb-8 p-4"
			class:pb-12={IS_CLOUD}
		>
			{@render children()}
		</div>
	</div>
	{#if IS_CLOUD}
		<Footer />
	{/if}

	<CreateNamespaceModal bind:open={openCreateNamespaceModal} />
	<EditNamespaceModal
		bind:open={openEditNamespaceModal}
		namespaceId={editNamespaceId}
		namespaceName={editNamespaceName}
	/>
	<Toaster position="bottom-center" richColors />
</Tooltip.Provider>
