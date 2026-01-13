<script lang="ts">
	import { page } from '$app/state';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import ErrorLoadResourceSection from '$lib/components/ui/error/ErrorLoadResourceSection.svelte';
	import type { Snippet } from 'svelte';

	// TODO: Add cloud integration
	// import { IS_CLOUD } from '$lib/config/build-target';
	// const isCloudAuthenticated = page.data.limits !== undefined;

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
</script>

{#if unknownPageNamespace}
	<ErrorLoadResourceSection />
{:else}
	<!-- TODO: Add cloud auth check: !IS_CLOUD || isCloudAuthenticated -->
	{@render children()}
{/if}
