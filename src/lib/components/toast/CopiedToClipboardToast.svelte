<script lang="ts">
	import { CheckCircleOutline } from 'flowbite-svelte-icons';
	import ToastBottom from '$lib/components/toast/BottomToast.svelte';

	export let toastStatus: boolean;
</script>

<ToastBottom bind:toastStatus>
	<CheckCircleOutline slot="icon" class="bg-transparent" />
	<p>Copied to clipboard</p>
</ToastBottom>
