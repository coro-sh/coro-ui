<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { activeNamespaceId } from '$lib/stores/namespace';

	onMount(() => {
		const namespaceId = $page.params.namespace;
		activeNamespaceId.set(namespaceId);
		goto(`/namespaces/${$activeNamespaceId}/operators`);
	});
</script>
