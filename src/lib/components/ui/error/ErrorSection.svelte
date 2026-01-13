<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		heading?: string;
		subheading: string;
		message: string;
	}

	let { heading = '', subheading, message }: Props = $props();

	function reloadHome() {
		window.location.href = '/';
	}
</script>

<section class="flex min-h-[60vh] items-center justify-center px-4">
	<div class="text-center">
		{#if heading}
			<h1 class="text-primary text-7xl font-extrabold tracking-tight lg:text-9xl">
				{heading}
			</h1>
		{/if}
		<p class="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
			{subheading}
		</p>
		<p class="text-muted-foreground mb-6 text-lg">
			{message}
		</p>
		<Button variant="destructive" size="lg" onclick={reloadHome}>Back to Homepage</Button>
	</div>
</section>
