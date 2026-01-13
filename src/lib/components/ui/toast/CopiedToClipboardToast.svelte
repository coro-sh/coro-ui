<script lang="ts">
	import { showCopied } from '$lib/stores/toast';

	interface Props {
		toastStatus: boolean;
	}

	let { toastStatus = $bindable(false) }: Props = $props();

	$effect(() => {
		if (toastStatus) {
			showCopied();
			toastStatus = false;
		}
	});
</script>
