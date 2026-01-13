<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Separator } from '$lib/components/ui/separator';
	import CopyableText from '$lib/components/ui/text/CopyableText.svelte';
	import CodeBlock from '$lib/components/ui/text/CodeBlock.svelte';
	import DeleteButton from '$lib/components/ui/button/DeleteButton.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Circle from '@lucide/svelte/icons/circle';

	interface Props {
		loading?: boolean;
		editable?: boolean;
		openEditModal?: boolean;
		name: string;
		data: Map<string, unknown>;
		limits?: Map<string, unknown> | null;
		copyableFields?: string[];
		jwt?: string | null;
		deleteCallback: () => Promise<void>;
	}

	let {
		loading = $bindable(true),
		editable = false,
		openEditModal = $bindable(false),
		name,
		data,
		limits = null,
		copyableFields = [],
		jwt = null,
		deleteCallback
	}: Props = $props();
</script>

<div class="flex justify-between items-center mb-8">
	<h2 class="text-xl font-semibold sm:text-2xl">Overview</h2>

	<div class="flex gap-2">
		{#if editable}
			<Button variant="outline" size="sm" onclick={() => (openEditModal = true)}>
				<Pencil class="size-4" />
				Edit
			</Button>
		{/if}
		<DeleteButton size="sm" {deleteCallback} />
	</div>
</div>

<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
	<h3 class="text-md font-semibold col-span-full">{name || 'General'}</h3>

	{#each data.entries() as [title, value]}
		<div>
			<h4 class="mb-2 text-sm font-bold text-muted-foreground">{title}</h4>
			{#if loading}
				<Skeleton class="h-4 w-24 mt-2" />
			{:else if copyableFields.includes(title)}
				<CopyableText spanId={String(value)} text={String(value ?? '')} class="text-sm" />
			{:else if title === 'NATS Status'}
				<Badge variant={value === 'Connected' ? 'success' : 'destructive'} class="flex items-center gap-1 w-fit">
					<Circle class="size-1.5! fill-current" />
					{value || 'Unknown'}
				</Badge>
			{:else}
				<p class="text-sm">{value || 'N/A'}</p>
			{/if}
		</div>
	{/each}

	{#if limits}
		<Separator class="col-span-full" />
		<h3 class="text-md font-semibold col-span-full">Limits</h3>

		{#each limits.entries() as [title, value]}
			<div>
				<h4 class="mb-2 text-sm font-bold text-muted-foreground">{title}</h4>
				{#if loading}
					<Skeleton class="h-4 w-24 mt-2" />
				{:else}
					<p class="text-sm">{value || 'Unlimited'}</p>
				{/if}
			</div>
		{/each}
	{/if}

	{#if jwt}
		<Separator class="col-span-full" />
		<h3 class="text-md font-semibold">JSON Web Token</h3>
		<div class="col-span-full">
			<CodeBlock content={jwt} wrap />
		</div>
	{/if}
</div>
