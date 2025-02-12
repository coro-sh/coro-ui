<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { activeNamespaceId } from '$lib/stores/namespace';

	onMount(() => {
		goto(`/namespaces/${$activeNamespaceId}/operators`);
	});
</script>
