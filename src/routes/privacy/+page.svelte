<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import privacyContent from '$lib/content/privacy.md?raw';

	let htmlContent = $state('');

	onMount(async () => {
		htmlContent = await marked.parse(privacyContent);
	});
</script>

<svelte:head>
	<title>Privacy Policy - Coro</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="prose prose-slate dark:prose-invert max-w-none">
		{@html htmlContent}
	</div>
</div>
