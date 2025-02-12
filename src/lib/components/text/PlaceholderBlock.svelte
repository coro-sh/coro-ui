<script lang="ts">

	export let segments: number = 3;
	export let lines: number = 3;

	const widths = [
		['w-3/12', 'w-2/12', 'w-6/12'],
		['w-4/12', 'w-5/12', 'w-1/12'],
		['w-1/12', 'w-4/12', 'w-3/12'],
		['w-4/12', 'w-4/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-4/12'],
		['w-7/12', 'w-2/12', 'w-1/12'],
		['w-3/12', 'w-4/12'],
		['w-1/12', 'w-2/12', 'w-5/12'],
		['w-6/12'],
		['w-3/12', 'w-2/12', 'w-4/12'],
		['w-1/12', 'w-2/12', 'w-5/12'],
		['w-4/12', 'w-5/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-3/12'],
		['w-4/12', 'w-4/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-4/12'],
		['w-3/12', 'w-2/12', 'w-6/12'],
		['w-4/12', 'w-5/12', 'w-1/12'],
		['w-1/12', 'w-4/12', 'w-3/12'],
		['w-4/12', 'w-4/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-4/12'],
		['w-7/12', 'w-2/12', 'w-1/12'],
		['w-3/12', 'w-4/12'],
		['w-1/12', 'w-2/12', 'w-5/12'],
		['w-6/12'],
		['w-3/12', 'w-2/12', 'w-4/12'],
		['w-1/12', 'w-2/12', 'w-5/12'],
		['w-4/12', 'w-5/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-3/12'],
		['w-4/12', 'w-4/12', 'w-2/12'],
		['w-3/12', 'w-2/12', 'w-4/12']
	];
</script>

<div role="status" class="animate-pulse">
	{#each Array(lines) as _, i}
		<div class="flex items-center space-x-2 rtl:space-x-reverse w-full">
			{#each widths[i] as width, j}
				{#if j < segments}
					{@const mb = i === lines - 1 ? "mb-0" : "mb-4"}
					<div class="h-2.5 bg-mono-500 rounded-full {mb} {width}"/>
				{/if}
			{/each}
		</div>
	{/each}
	<span class="sr-only">Loading...</span>
</div>
