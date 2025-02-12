<script lang="ts">
	import { CloseCircleOutline } from 'flowbite-svelte-icons';
	import ToastBottom from '$lib/components/toast/BottomToast.svelte';

	export let error: Error | null = null;
	let toastStatus = false;
	let name: string = 'Unknown error';
	let messages: string[] = [];

	$: if (error) {
		toastStatus = true;
		name = error.name;
		messages = error.message.split(';');
		error = null;
	}
</script>

<ToastBottom bind:toastStatus backgroundColor="red" size="xl" clearDuration={4000}>
	<CloseCircleOutline slot="icon" class="bg-transparent" />
	<div class="ml-2">
		<p class="text-md font-semibold mb-1">{name}</p>
		{#each messages as msg, i}
			<div class="text-sm {i === messages.length - 1 ? 'mb-0.5' : ''}">
				{msg}
			</div>
		{/each}
	</div>
</ToastBottom>
