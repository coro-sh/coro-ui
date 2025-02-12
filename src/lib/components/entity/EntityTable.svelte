<script lang="ts">
	import {
		Button,
		Heading,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toolbar
	} from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import PlaceholderBlock from '$lib/components/text/PlaceholderBlock.svelte';
	import { upperCaseFirstChar } from '$lib/util';
	import { createEventDispatcher } from 'svelte';

	export let loading = true;
	export let entityType: 'operator' | 'account' | 'user';
	export let columns: string[];
	export let openCreateModal: boolean;
	export let isEmpty: boolean;
	export let hasMore: boolean;
	export let loadingMore: boolean;

	const dispatch = createEventDispatcher();
</script>

<Toolbar embedded class="w-full py-4">
	<Heading tag="h2" class="text-xl font-semibold sm:text-2xl w-full pb-2">
		{`${upperCaseFirstChar(entityType)}s`}
	</Heading>
	<div slot="end" class="flex items-center space-x-2">
		<Button on:click={() => { openCreateModal = true }} size="md" class="gap-2 whitespace-nowrap px-3">
			<PlusOutline size="md" />
			{`Create ${upperCaseFirstChar(entityType)}`}
		</Button>
	</div>
</Toolbar>

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
				{#if isEmpty}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length}>
							<div class="text-base text-center items-center text-mono-500 my-20">
								<p class="mb-5">{`No ${upperCaseFirstChar(entityType)}s found`}</p>

								<Button color="alternative" on:click={() => { openCreateModal = true }} size="md"
												class="gap-2 whitespace-nowrap px-3">
									<PlusOutline size="md" />
									{`Create ${upperCaseFirstChar(entityType)}`}
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<slot />
				{/if}
				{#if hasMore}
					<TableBodyRow>
						<TableBodyCell colspan={columns.length} class="pt-10">
							<div class="flex justify-center">
								<Button on:click={() => { dispatch('loadMore') }}>
									{#if loadingMore}
										<Spinner size={4} color="gray" />
									{:else}
										Load More
									{/if}
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/if}
		</TableBody>
	</Table>
</div>
