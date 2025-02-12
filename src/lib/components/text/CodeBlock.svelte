<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ChevronDownOutline, ChevronUpOutline, ClipboardOutline } from 'flowbite-svelte-icons';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import { twMerge } from 'tailwind-merge';
	import Highlight from 'svelte-highlight';
	import './styles/github-dark.css';
	import CopiedToClipboardToast from '$lib/components/toast/CopiedToClipboardToast.svelte';
	import type { CodeBlockLanguage } from '$lib/components/text/code-block-language';

	export let content: string;
	export let loading = true;
	export let contentClass = '';
	export let language: CodeBlockLanguage | undefined = undefined;

	let showCopiedToClipboard = false;
	let expanded = false;

	$: codeLines = content ? content.split('\n') : [];
	$: exceedsLimit = codeLines.length > 15;

	function copyToClipboard() {
		navigator.clipboard.writeText(content).then(() => {
			showCopiedToClipboard = true;
		});
	}
</script>

<div
	class={twMerge("relative z-10 bg-light-alt dark:bg-dark-canvas border border-mono-600 rounded-md p-6 flex flex-col", contentClass)}>
	<Button
		size="xs"
		color="alternative"
		class="absolute top-2 right-2 p-1.5 bg-transparent border-mono-400 dark:border-mono-500 hover:bg-transparent hover:dark:bg-transparent hover:border-white hover:dark:border-white group z-20"
		on:click={copyToClipboard}
		aria-label="Copy to clipboard">
		<ClipboardOutline size="sm" class="text-mono-300 group-hover:text-white" />
	</Button>

	<div class="relative">
		<!-- Add bottom padding when not expanded -->
		<div
			class={twMerge(
			"text-xs text-mono-100 font-mono whitespace-pre-wrap break-words",
			exceedsLimit && !expanded ? "max-h-[300px] overflow-hidden" : "",
			exceedsLimit ? "pb-12" : "",
			language ? 'w-[94%]' : 'w-[98%]'
		)}>
			{#if loading}
				<div class="-mb-3">
					<PlaceholderBlock segments={3} lines={15} />
				</div>
			{:else if language}
				<Highlight language={language} code={content ?? ''} />
			{:else}
				{content ?? ''}
			{/if}
		</div>

		{#if exceedsLimit}
			<div
				class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-light-alt dark:from-dark-canvas flex flex-col items-center">
				{#if !expanded}
					<Button
						color="none"
						size="sm"
						class="flex items-center justify-between border border-mono-500 text-mono-400 bg-mono-800 hover:bg-mono-700 dark:bg-mono-900 dark:hover:bg-mono-800"
						on:click={() => expanded = true}>
						Show More
						<ChevronDownOutline />
					</Button>
				{:else}
					<Button
						color="none"
						size="sm"
						class="flex items-center justify-between border border-mono-500 text-mono-400 bg-mono-800 hover:bg-mono-700 dark:bg-mono-900 dark:hover:bg-mono-800"
						on:click={() => {
							expanded = false
						}}>
						Show Less
						<ChevronUpOutline />
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<CopiedToClipboardToast bind:toastStatus={showCopiedToClipboard} />
