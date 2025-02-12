<script lang="ts">
	import { Badge, Button, Heading, Indicator } from 'flowbite-svelte';
	import CopyableText from '$lib/components/text/CopyableText.svelte';
	import CodeBlock from '$lib/components/text/CodeBlock.svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import Divider from '$lib/components/layout/Divider.svelte';
	import DeleteButton from '$lib/components/button/DeleteButton.svelte';

	export let loading: boolean; // bind
	export let editable = false;
	export let openEditModal = false; // bind
	export let name: string;
	export let data: Map<string, any>;
	export let limits: Map<string, any> | null = null;
	export let copyableFields: string[] = [];
	export let jwt: string | null = null;
	export let deleteCallback: () => Promise<void>;
</script>

<div class="flex justify-between items-center mb-8">
	<Heading tag="h2" class="text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2">
		Overview
	</Heading>

	{#if editable}
		<Button size="xs" class="px-4 mr-3" on:click={() => {
			if (editable) {
				openEditModal = true;
			}
		}}>
			<svg aria-hidden="true" class="mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
					 xmlns="http://www.w3.org/2000/svg">
				<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
				<path fill-rule="evenodd"
							d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
							clip-rule="evenodd" />
			</svg>
			Edit
		</Button>
	{/if}
	<DeleteButton size="xs" deleteCallback={deleteCallback} />
</div>

<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
	<Heading tag="h3" class="text-md font-semibold text-light-base dark:text-dark-base col-span-full">
		{name || 'General'}
	</Heading>

	{#each data.entries() as [title, value]}
		<div class="text-light-base dark:text-dark-base">
			<Heading tag="h3" class="-ml-0.25 mb-2 text-sm font-bold text-light-alt dark:text-dark-alt">
				{title}
			</Heading>
			{#if loading}
				<div class="mt-4">
					<PlaceholderLine width="4/12" />
				</div>
			{:else}
				{#if copyableFields.includes(title)}
					<CopyableText spanClass="text-sm -mt-3"
												spanId="{value}"
												text={value ?? ''} />
				{:else if title === 'NATS Status'}
					<Badge color={value === 'Connected' ? 'green' : 'red' } rounded class="px-2.5 py-0.5 align-middle">
						<Indicator color={value === 'Connected' ? 'green' : 'red' } size="xs" class="me-1" />
						{value || 'Unknown'}
					</Badge>
				{:else}
					<p class="text-sm">{value || 'N/A'}</p>
				{/if}
			{/if}
		</div>
	{/each}

	{#if limits}
		<Divider />
		<Heading tag="h3" class="text-md font-semibold text-light-base dark:text-dark-base col-span-full">
			Limits
		</Heading>

		{#each limits.entries() as [title, value]}
			<div class="text-light-base dark:text-dark-base">
				<Heading tag="h3" class="mb-2 text-sm font-bold text-light-alt dark:text-dark-alt">
					{title}
				</Heading>
				{#if loading}
					<div class="mt-4">
						<PlaceholderLine width="4/12" />
					</div>
				{:else}
					<p class="text-sm">{value || 'Unlimited'}</p>
				{/if}
			</div>
		{/each}
	{/if}

	{#if jwt}
		<Divider />
		<Heading tag="h3" class="text-md font-semibold text-light-base dark:text-dark-base">
			JSON Web Token
		</Heading>
		<CodeBlock bind:loading contentClass="col-span-full" content={jwt || 'No JWT available'} />
	{/if}
</div>
