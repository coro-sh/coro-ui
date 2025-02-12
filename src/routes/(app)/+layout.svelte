<script lang="ts">
	import { activeNamespaceId, namespaces } from '$lib/stores/namespace';
	import { page } from '$app/stores';
	import ErrorLoadResourceSection from '$lib/components/error/ErrorLoadResourceSection.svelte';

	let unknownPageNamespace = false;

	const pageNamespace = $page.params.namespace;
	if ($namespaces.length) {
		if (pageNamespace) {
			if (!$namespaces.find(item => item.id === pageNamespace)) {
				unknownPageNamespace = true;
			} else {
				activeNamespaceId.set(pageNamespace);
			}
		} else {
			const defaultNS = $namespaces.find(item => item.name === 'default');
			if (defaultNS) {
				activeNamespaceId.set(defaultNS.id);
			} else {
				activeNamespaceId.set($namespaces[0].id);
			}
		}
	} else if ($page.url.pathname !== '/') {
		window.location.href = '/';
	}
</script>

{#if unknownPageNamespace}
	<ErrorLoadResourceSection />
{:else}
	<slot />
{/if}
