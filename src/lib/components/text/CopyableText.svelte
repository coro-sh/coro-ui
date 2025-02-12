<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import { shortenStr } from '$lib/util';
	import CopiedToClipboardToast from '$lib/components/toast/CopiedToClipboardToast.svelte';

	export let spanId: string;
	export let text: string;
	export let maxLen = 30;
	export let spanClass = ''

	const shortenedText = shortenStr(text, maxLen);
	let showCopiedToClipboard = false;

	function handleCopiedToClipboard() {
		navigator.clipboard.writeText(text).then(() => {
			showCopiedToClipboard = true;
			setTimeout(() => {
				showCopiedToClipboard = false;
			}, 2000);
		});
	}
</script>

<span class={spanClass}
			id={spanId}
			role="button"
			tabindex="0"
			aria-label="Copy to clipboard"
			on:click={handleCopiedToClipboard}
			on:keydown={(e) => e.key === 'Enter' && handleCopiedToClipboard()}>
	{shortenedText}
</span>

{#if shortenedText.length < text.length}
	<Tooltip triggeredBy="#{spanId}" placement="bottom">
		{text}
	</Tooltip>
{/if}

<CopiedToClipboardToast bind:toastStatus={showCopiedToClipboard} />
