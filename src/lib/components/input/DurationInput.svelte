<script lang="ts">
	import { NumberInput, Select } from 'flowbite-svelte';

	export let durationInSeconds: number | undefined;

	let value = !durationInSeconds ? 0 : durationInSeconds;

	let unit = !durationInSeconds ? 'unlimited' : 'seconds';

	const durationUnits = [
		{ value: 'seconds', name: 'Seconds' },
		{ value: 'minutes', name: 'Minutes' },
		{ value: 'hours', name: 'Hours' },
		{ value: 'days', name: 'Days' },
		{ value: 'unlimited', name: 'Unlimited' }
	];
	const durationMultipliers: Record<string, number> = {
		'seconds': 1,
		'minutes': 60,
		'hours': 3600,
		'days': 86400
	};

	function updateDuration() {
		if (unit === 'unlimited') {
			value = 0;
			durationInSeconds = undefined;
			return;
		}
		const mult = durationMultipliers[unit];
		durationInSeconds = value * (mult || 1);
	}
</script>

<div class="flex space-x-2 items-center">
	<Select bind:value={unit} items={durationUnits} class="w-28 dark:bg-gray-600 dark:border-gray-500"
					on:change={updateDuration} />
	<NumberInput bind:value min={1} step={1} on:change={updateDuration} disabled={unit === 'unlimited'} />
</div>
