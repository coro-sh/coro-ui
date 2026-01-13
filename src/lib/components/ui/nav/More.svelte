<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { cn } from '$lib/utils';

	interface Props {
		href?: string;
		hover?: boolean;
		class?: string;
	}

	let { href, hover = false, class: className }: Props = $props();

	const baseClass = 'inline-flex items-center text-xs font-medium text-primary sm:text-base p-2';
	const hoverClass = $derived(hover ? 'rounded-lg hover:bg-accent uppercase' : '');
</script>

<div class={cn(baseClass, hoverClass, className)}>
	{#if href}
		<a {href}>
			<ChevronRight class="size-5" />
		</a>
	{:else}
		<ChevronRight class="size-5" />
	{/if}
</div>
