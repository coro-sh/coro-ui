<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

	onMount(() => {
		const namespaceId = page.params.namespace;
		namespaceStore.setActiveId(namespaceId);
		goto(`/namespaces/${namespaceId}/operators`);
	});
</script>
