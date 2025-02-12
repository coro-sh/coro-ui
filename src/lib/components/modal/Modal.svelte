<script lang="ts">
	import { Button, Modal, Spinner } from 'flowbite-svelte';

	export let open: boolean = false;
	export let loading = false;
	export let cols = 2;
	export let title: string;
	export let submitButtonText: string;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let dismissable = true;
</script>

<Modal bind:open color="none"
			 title={title}
			 size={size}
			 autoclose={false}
			 dismissable={dismissable}
			 outsideclose
			 class="m-4"
			 classBackdrop="bg-mono-500 dark:bg-mono-900"
			 classBody="bg-light-content dark:bg-dark-content border-none"
			 classHeader="bg-light-content dark:bg-dark-content border-b border-light-border dark:border-dark-border"
			 classFooter="bg-light-content dark:bg-dark-content border-b border-light-border dark:border-dark-border">
	<div class="grid gap-4 mb-4 sm:grid-cols-{cols}">
		<slot />
	</div>

	<svelte:fragment slot="footer">
		<div class="flex justify-end w-full">
			<Button slot="footer" type="submit" class="w-36">
				{#if loading}
					<Spinner size={4} color="gray" />
				{:else}
					{submitButtonText}
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
