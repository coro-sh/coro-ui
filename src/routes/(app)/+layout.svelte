<script lang="ts">
	import { page } from '$app/state';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { cloudClient } from '$lib/cloud-client';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import type { Snippet } from 'svelte';
	import { IS_CLOUD } from '$lib/config/build-target';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let unknownPageNamespace = $state(false);

	$effect(() => {
		const pageNamespace = page.params.namespace;
		const namespaces = namespaceStore.namespaces;

		if (namespaces.length) {
			if (pageNamespace) {
				if (!namespaces.find((item) => item.id === pageNamespace)) {
					unknownPageNamespace = true;
				} else {
					unknownPageNamespace = false;
					namespaceStore.setActiveId(pageNamespace);
				}
			} else {
				const defaultNS = namespaces.find((item) => item.name === 'default');
				namespaceStore.setActiveId(defaultNS?.id ?? namespaces[0].id);
			}
		} else if (page.url.pathname !== '/') {
			window.location.href = '/';
		}
	});

	// Redirect to login if cloud mode and not authenticated
	$effect(() => {
		if (IS_CLOUD && !authStore.isAuthenticated && !authStore.loading) {
			cloudClient.login();
		}
	});
</script>

{#if unknownPageNamespace}
	<ErrorLoadResourceSection />
{:else if IS_CLOUD && !authStore.isAuthenticated}
	<!-- Show nothing while redirecting to login -->
	<div class="flex h-screen items-center justify-center">
		<div class="text-muted-foreground">Redirecting to login...</div>
	</div>
{:else}
	{@render children()}
{/if}
