<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
	import PlaceholderLine from '$lib/components/text/PlaceholderLine.svelte';
	import type { StreamResponse } from '$lib/models/entity.js';
	import { formatEpochSeconds } from '$lib/util';

	export let loading: boolean;
	export let stream: StreamResponse;

	const streamFields = ['Name', 'Messages', 'Consumers', 'Created'] as const;
	let streamData: Map<typeof streamFields[any], any> = new Map();

	for (const field of streamFields) {
		streamData.set(field, 'Unknown');
	}

	$: if (stream) {
		streamData = new Map(streamData); // trigger reactivity
		streamData.set('Name', stream.name);
		streamData.set('Messages', stream.message_count);
		streamData.set('Consumers', stream.consumer_count);
		streamData.set('Created', formatEpochSeconds(stream.create_time));
	}
</script>

<div class="mb-8 items-center">
			<span class="text-3xl font-bold leading-none text-light-base dark:text-dark-base">
				{#if loading}
					<div class="mt-10 mb-10">
						<PlaceholderLine width="2/12" />
					</div>
				{:else}
					{stream.name}
				{/if}
			</span>
</div>
<Card size="xl"
			class="shadow-sm max-w-none dark:bg-dark-content border-light-border dark:border-dark-border">
	<div class="m-4">
		<Heading tag="h2" class="mb-6 text-xl font-semibold text-light-base dark:text-dark-base sm:text-2xl w-full pb-2">
			Info
		</Heading>
		<div class="grid lg:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
			{#each streamData.entries() as [title, value]}
				<div class="text-light-base dark:text-dark-base">
					<Heading tag="h3" class="-ml-0.25 mb-2 text-sm font-bold text-light-alt dark:text-dark-alt">
						{title}
					</Heading>
					{#if loading}
						<div class="mt-4">
							<PlaceholderLine width="4/12" />
						</div>
					{:else}
						<p class="text-sm">{value ?? 'N/A'}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Card>
