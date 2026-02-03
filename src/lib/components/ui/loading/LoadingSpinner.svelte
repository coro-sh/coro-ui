<script lang="ts">
	import { Loader2 } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		message?: string;
		size?: number;
		class?: string;
	}

	let { message, size = 24, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center gap-3', className)}>
	<Loader2 class="animate-spin text-muted-foreground" {size} />
	{#if message}
		<div class="text-muted-foreground text-sm">{message}</div>
	{/if}
</div>
