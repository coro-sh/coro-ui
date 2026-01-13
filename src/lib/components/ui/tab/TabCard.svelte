<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<Card.Root class="shadow-sm">
	<Card.Content class="pt-2">
		{@render children()}
	</Card.Content>
</Card.Root>
