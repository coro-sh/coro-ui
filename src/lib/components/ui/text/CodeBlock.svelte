<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { showCopied } from '$lib/stores/toast';
	import { cn } from '$lib/utils';
	import { Highlight } from 'svelte-highlight';
	import type { LanguageType } from 'svelte-highlight/languages';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';

	interface Props {
		content: string;
		loading?: boolean;
		class?: string;
		language?: LanguageType<string>;
		wrap?: boolean;
	}

	let { content, loading = false, class: className = '', language, wrap = false }: Props = $props();

	let expanded = $state(false);
	let copied = $state(false);

	const codeLines = $derived(content ? content.split('\n') : []);
	const exceedsLimit = $derived(codeLines.length > 15);

	function copyToClipboard() {
		copied = true;
		navigator.clipboard.writeText(content).then(() => {
			showCopied();
		});
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<div
	class={cn(
		'code-block relative flex max-w-full flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 p-4',
		className
	)}
>
	<div class="absolute top-0 right-0 z-10 bg-zinc-900 p-2">
		<Button
			variant="outline"
			size="icon"
			class={cn(
				'size-8 border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
				copied && 'border-green-500 bg-green-500/10'
			)}
			onclick={copyToClipboard}
			aria-label="Copy to clipboard"
		>
			{#if copied}
				<Check class="size-4 text-green-500" />
			{:else}
				<Clipboard class="size-4" />
			{/if}
		</Button>
	</div>

	<div class={cn('relative min-w-0', !wrap && 'mr-10 overflow-x-auto')}>
		<div
			class={cn(
				'font-mono text-xs text-zinc-200',
				wrap ? 'pr-10 break-all whitespace-pre-wrap' : 'whitespace-pre',
				exceedsLimit && !expanded ? 'max-h-[300px] overflow-hidden' : '',
				exceedsLimit ? 'pb-12' : ''
			)}
		>
			{#if loading}
				<div class="space-y-2">
					{#each { length: 10 } as _}
						<Skeleton class="h-4 w-full" />
					{/each}
				</div>
			{:else if language}
				<Highlight {language} code={content ?? ''} />
			{:else}
				{content ?? ''}
			{/if}
		</div>

		{#if exceedsLimit && !loading}
			<div
				class="absolute bottom-0 left-0 flex w-full flex-col items-center bg-gradient-to-t from-zinc-900 pt-8"
			>
				{#if !expanded}
					<Button variant="outline" size="sm" onclick={() => (expanded = true)}>
						Show More
						<ChevronDown class="size-4" />
					</Button>
				{:else}
					<Button variant="outline" size="sm" onclick={() => (expanded = false)}>
						Show Less
						<ChevronUp class="size-4" />
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Override svelte-highlight's default pre/code styling */
	.code-block :global(pre) {
		background: transparent !important;
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
	}

	.code-block :global(code) {
		background: transparent !important;
		padding: 0 !important;
	}
</style>
