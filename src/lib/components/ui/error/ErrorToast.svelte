<script lang="ts">
	import { showError } from '$lib/stores/toast';

	interface Props {
		error: Error | null;
	}

	let { error = $bindable(null) }: Props = $props();

	$effect(() => {
		if (error) {
			showError(error);
			error = null;
		}
	});
</script>
