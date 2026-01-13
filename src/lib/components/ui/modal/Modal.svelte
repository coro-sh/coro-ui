<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		loading?: boolean;
		cols?: 1 | 2 | 3 | 4;
		title: string;
		submitButtonText: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		dismissable?: boolean;
		onsubmit?: (e: SubmitEvent) => void;
		children: Snippet;
	}

	let {
		open = $bindable(false),
		loading = $bindable(false),
		cols = 2,
		title,
		submitButtonText,
		size = 'md',
		dismissable = true,
		onsubmit,
		children
	}: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'sm:max-w-sm',
		md: 'sm:max-w-md',
		lg: 'sm:max-w-lg',
		xl: 'sm:max-w-xl'
	};

	const gridColsClasses: Record<number, string> = {
		1: 'sm:grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-3',
		4: 'sm:grid-cols-4'
	};

	function handleOpenChange(value: boolean) {
		if (dismissable || !value) {
			open = value;
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<Dialog.Content
		class={sizeClasses[size]}
		showCloseButton={dismissable}
		onInteractOutside={(e) => !dismissable && e.preventDefault()}
		onEscapeKeydown={(e) => !dismissable && e.preventDefault()}
	>
		<form class="flex flex-col space-y-6" {onsubmit}>
			<Dialog.Header>
				<Dialog.Title>{title}</Dialog.Title>
			</Dialog.Header>

			<div class="grid gap-4 {gridColsClasses[cols]}">
				{@render children()}
			</div>

			<Dialog.Footer>
				<Button type="submit" class="w-36" disabled={loading}>
					{#if loading}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						{submitButtonText}
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
