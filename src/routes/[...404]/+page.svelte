<script lang="ts">
	import ErrorSection from '$lib/components/ui/error/ErrorSection.svelte';
	import LoadingSpinner from '$lib/components/ui/loading/LoadingSpinner.svelte';
	import { IS_CLOUD } from '$lib/config/build-target';
	import { authStore } from '$lib/stores/auth.svelte';
	import { cloudClient } from '$lib/cloud-client';

	// Redirect to login if cloud mode and not authenticated
	$effect(() => {
		if (IS_CLOUD && !authStore.isAuthenticated && !authStore.loading) {
			cloudClient.login();
		}
	});
</script>

{#if IS_CLOUD && !authStore.isAuthenticated}
	<div class="fixed inset-0 flex items-center justify-center">
		<LoadingSpinner message="Redirecting to login..." />
	</div>
{:else}
	<ErrorSection
		heading="404"
		subheading="Something's missing"
		message="Sorry, we can't find that page. There's more to explore on the home page."
	/>
{/if}
