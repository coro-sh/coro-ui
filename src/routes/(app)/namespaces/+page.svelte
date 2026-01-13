<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { namespaceStore } from '$lib/stores/namespace.svelte';

	onMount(() => {
		if (namespaceStore.activeId) {
			goto(`/namespaces/${namespaceStore.activeId}/operators`);
		}
	});
</script>
