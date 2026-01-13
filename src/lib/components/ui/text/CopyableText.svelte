<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { shortenStr } from '$lib/utils';
	import { showCopied } from '$lib/stores/toast';

	interface Props {
		spanId: string;
		text: string;
		maxLen?: number;
		class?: string;
	}

	let { spanId, text, maxLen = 30, class: className = '' }: Props = $props();

	const shortenedText = $derived(shortenStr(text, maxLen));
	const isTruncated = $derived(shortenedText.length < text.length);

	function handleCopy() {
		navigator.clipboard.writeText(text).then(() => {
			showCopied();
		});
	}
</script>

{#if isTruncated}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<span
				class="cursor-pointer hover:text-primary {className}"
				id={spanId}
				role="button"
				tabindex="0"
				aria-label="Copy to clipboard"
				onclick={handleCopy}
				onkeydown={(e) => e.key === 'Enter' && handleCopy()}
			>
				{shortenedText}
			</span>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{text}</p>
		</Tooltip.Content>
	</Tooltip.Root>
{:else}
	<span
		class="cursor-pointer hover:text-primary {className}"
		id={spanId}
		role="button"
		tabindex="0"
		aria-label="Copy to clipboard"
		onclick={handleCopy}
		onkeydown={(e) => e.key === 'Enter' && handleCopy()}
	>
		{text}
	</span>
{/if}
