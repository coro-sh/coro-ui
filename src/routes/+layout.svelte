<script lang="ts">
	import '../app.css';
	import { Button, Dropdown, DropdownDivider, DropdownItem, Navbar, NavBrand, Spinner } from 'flowbite-svelte';
	import { isDarkTheme } from '$lib/stores/theme';
	import DarkMode from '$lib/components/theme/DarkMode.svelte';
	import { activeNamespaceId, getNamespaceName, namespaces, namespacesLoading } from '$lib/stores/namespace';
	import ErrorToast from '$lib/components/toast/ErrorToast.svelte';
	import {
		CheckCircleOutline,
		CheckOutline,
		ChevronDownOutline,
		ChevronUpOutline,
		DotsVerticalOutline,
		PlusOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import CreateNamespaceModal from '$lib/components/namespace/CreateNamespaceModal.svelte';
	import { errorToast, showErrorToast, showSuccessToast, successToast } from '$lib/stores/toast';
	import BottomToast from '$lib/components/toast/BottomToast.svelte';
	import { CoroClient } from '$lib/coro-client';

	$: logoImage = $isDarkTheme ? 'logo-dark.svg' : 'logo-light.svg';

	const mxClass = 'lg:mx-[5%] xl:mx-[10%] 2xl:mx-[17%]';
	let dropdownOpen = false;
	let openCreateNamespaceModal = false;
	let hoveredNamespaceId: string | null;
	let activeNamespaceOptionsOpen: string | null;

	$: if (!dropdownOpen) {
		// reset namespace sub-dropdown on close
		activeNamespaceOptionsOpen = null;
	}

	function toggleSubDropdown(namespaceId: string) {
		activeNamespaceOptionsOpen = activeNamespaceOptionsOpen === namespaceId ? null : namespaceId;
	}

	if (!$activeNamespaceId) {
		assignDefaultNamespace();
	}

	function assignDefaultNamespace() {
		activeNamespaceId.set($namespaces.find(item => item.name === 'default')?.id ?? $namespaces[0].id);
	}

	function updateActiveNamespaceButton(selectedId: string) {
		dropdownOpen = false;
		if (selectedId === $activeNamespaceId) {
			return;
		}
		activeNamespaceId.set(selectedId);
		goto(`/namespaces/${$activeNamespaceId}`);
	}

	let deleteNamespaceLoading = false;

	async function deleteNamespace(namespaceId: string) {
		try {
			deleteNamespaceLoading = true;
			await new CoroClient().deleteNamespace(namespaceId);
			showSuccessToast('Namespace deleted');
			namespaces.update(namespaces => namespaces.filter(item => item.id !== namespaceId));
			if ($activeNamespaceId === namespaceId) {
				assignDefaultNamespace();
				await goto(`/namespaces/${$activeNamespaceId}`);
			}
		} catch (e) {
			showErrorToast(e);
		} finally {
			deleteNamespaceLoading = false;
		}

	}
</script>

<header
	class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-light-border dark:border-dark-border bg-light-content dark:bg-dark-canvas">
	<div class={mxClass}>
		<Navbar fluid={true} class="text-light-base dark:text-dark-base flex items-center justify-between" color="none">
			<div class="flex items-center">
				<NavBrand href="/" class="mr-5 mt-2 mb-2">
					<img src="/images/{logoImage}" class="h-6 sm:h-6 my-1" alt="coro logo" />
				</NavBrand>

				{#if $namespaces.length}
					<div class="relative ml-[3px]">
						<Button size="sm"
										class="min-w-36 min-h-9 flex items-center {$namespacesLoading ? 'justify-center' : 'justify-between' }">
							{#if $namespacesLoading}
								<Spinner color="custom" customColor="fill-primary-400" size={5} />
							{:else}
								{$activeNamespaceId ? getNamespaceName($activeNamespaceId) : 'Select namespace'}
								{#if dropdownOpen}
									<ChevronUpOutline />
								{:else}
									<ChevronDownOutline />
								{/if}
							{/if}
						</Button>
						{#if !$namespacesLoading}
							<Dropdown bind:open={dropdownOpen}
												class="z-20 w-52 bg-light-content dark:bg-dark-content border border-light-border dark:border-dark-border shadow-lg rounded-md">
								<DropdownItem class="justify-between flex items-center hover:bg-mono-100 dark:hover:bg-mono-600"
															on:click={() => { openCreateNamespaceModal = true; }}>
									Create Namespace
									<PlusOutline size="sm" />
								</DropdownItem>
								<DropdownDivider />
								{#each $namespaces as namespace}
									<DropdownItem
										class="justify-between flex items-center relative hover:bg-mono-100 dark:hover:bg-mono-600"
										on:click={() => { updateActiveNamespaceButton(namespace.id) }}
									>
										{namespace.name}
										{#if $activeNamespaceId === namespace.id}
											<span
												class="relative"
												role="presentation"
												tabindex="-1"
												on:mouseenter={() => { hoveredNamespaceId = namespace.id }}
												on:mouseleave={() => { hoveredNamespaceId = null }}
											>
												<CheckOutline size="sm" />
												{#if hoveredNamespaceId === namespace.id}
													<button
														class="hover:bg-mono-200 dark:hover:bg-mono-700 absolute right-0 top-0"
														on:click={(e) => { e.stopPropagation(); toggleSubDropdown(namespace.id); }}
													>
														<DotsVerticalOutline size="sm" />
													</button>
												{/if}
											</span>
										{:else}
											<button
												class="hover:bg-mono-200 dark:hover:bg-mono-700"
												on:click={(e) => { e.stopPropagation(); toggleSubDropdown(namespace.id); }}
											>
												<DotsVerticalOutline size="sm" />
											</button>
										{/if}

										<!-- Sub-dropdown -->
										{#if activeNamespaceOptionsOpen === namespace.id}
											<div
												role="menu"
												aria-label="Namespace options"
												tabindex="0"
												class="absolute left-full top-0 ml-2 min-w-48 bg-light-content dark:bg-dark-content border border-light-border dark:border-dark-border shadow-lg rounded-md"
												on:click|stopPropagation
												on:keydown={(e) => {
														if (e.key === 'Escape') activeNamespaceOptionsOpen = null;
												}}
											>
												<!-- TODO: support editing namespace -->
												<!--  <DropdownItem class="justify-between flex items-center" on:click={() => console.log("Edit " + namespace.name)}>-->
												<!--  	Edit Namespace-->
												<!--  	<svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"-->
												<!--  			 xmlns="http://www.w3.org/2000/svg">-->
												<!--  		<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />-->
												<!--  		<path fill-rule="evenodd"-->
												<!--  					d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"-->
												<!--  					clip-rule="evenodd" />-->
												<!--  	</svg>-->
												<!--  </DropdownItem>-->
												<DropdownItem class="text-red-500 justify-between flex items-center"
																			on:click={() => deleteNamespace(namespace.id)}>
													Delete Namespace
													{#if deleteNamespaceLoading}
														<Spinner size={4} color="gray" />
													{:else}
														<TrashBinOutline size="sm" />
													{/if}
												</DropdownItem>
											</div>
										{/if}
									</DropdownItem>
								{/each}
							</Dropdown>
						{/if}
					</div>
				{/if}
			</div>

			<DarkMode />
		</Navbar>
	</div>
</header>
<div class="overflow-hidden lg:flex">
	<div class="relative h-full w-full overflow-y-auto pt-[70px] {mxClass} mt-4 mb-8 p-4">
		<slot />
	</div>
</div>

<CreateNamespaceModal bind:open={openCreateNamespaceModal} />

<!-- Success toast -->
<BottomToast toastStatus={$successToast !== null} backgroundColor="primary" size="xl" clearDuration={5000}>
	<CheckCircleOutline slot="icon" class="bg-transparent" />
	<div class="ml-2">
		<p class="text-md font-semibold mb-1">{$successToast}</p>
	</div>
</BottomToast>

<!-- Error toast -->
<ErrorToast error={$errorToast} />
