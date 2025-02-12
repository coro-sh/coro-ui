<script lang="ts">
	import { Page404, Section } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';

	export let heading: string = '';
	export let subheading: string;
	export let message: string;

	function reloadHome() {
		window.location.href = '/';
	}
</script>

<Section name="page404" sectionClass="mt-36">
	<Page404>
		<svelte:fragment slot="h1">{heading}</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{subheading}</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">{message}</p>
			<Button on:click={reloadHome} size="lg" color="none" class="bg-red-700 dark:bg-red-750 text-red-100">Back to
				Homepage
			</Button>
		</svelte:fragment>
	</Page404>
</Section>
