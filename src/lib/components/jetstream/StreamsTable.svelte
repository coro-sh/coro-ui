<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { type StreamResponse } from '$lib/models/entity';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import More from '$lib/components/nav/More.svelte';
	import { goto } from '$app/navigation';
	import { formatEpochSeconds } from '$lib/util';

	export let loading = true;
	export let streams: StreamResponse[];

	const columns = ['Name', 'Consumers', 'Messages', 'Created', ''];
</script>

<div class="overflow-x-auto">
	<Table noborder={true} color="custom" class="table-auto w-full dark:bg-none">
		<TableHead class="sticky top-0 bg-mono-200 dark:bg-mono-700">
			{#each columns as title}
				<TableHeadCell class="p-4 font-medium whitespace-nowrap w-1/12">{title}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#if loading}
				<TableBodyRow>
					{#each columns as col}
						{#if col}
							<TableBodyCell class="p-4">
								<PlaceholderBlock lines={1} />
							</TableBodyCell>
						{/if}
					{/each}
				</TableBodyRow>
			{:else}
				{#if streams.length === 0}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length}>
							<div class="text-base text-center items-center text-mono-500 my-20">
								<p class="mb-5">{`No streams found`}</p>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					{#each streams as stream}
						<TableBodyRow
							class={'cursor-pointer hover:bg-light-contentHover dark:hover:bg-dark-contentHover border-light-border dark:border-dark-border'}
							on:click={() => {goto('');}}
						>
							{#each [stream.name, stream.consumer_count, stream.message_count, formatEpochSeconds(stream.create_time)] as val}
								<TableBodyCell class="p-4 text-light-base dark:text-dark-base">
									{val}
								</TableBodyCell>
							{/each}
							<TableBodyCell class="p-4 text-right">
								<More />
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/if}
			{/if}
		</TableBody>
	</Table>
</div>
