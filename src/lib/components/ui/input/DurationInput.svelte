<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	interface Props {
		durationInSeconds?: number;
	}

	let { durationInSeconds = $bindable() }: Props = $props();

	let value = $state(!durationInSeconds ? 0 : durationInSeconds);
	let unit = $state(!durationInSeconds ? 'unlimited' : 'seconds');

	const durationUnits = [
		{ value: 'seconds', label: 'Seconds' },
		{ value: 'minutes', label: 'Minutes' },
		{ value: 'hours', label: 'Hours' },
		{ value: 'days', label: 'Days' },
		{ value: 'unlimited', label: 'Unlimited' }
	];

	const durationMultipliers: Record<string, number> = {
		seconds: 1,
		minutes: 60,
		hours: 3600,
		days: 86400
	};

	const selectedLabel = $derived(durationUnits.find((u) => u.value === unit)?.label ?? unit);

	function updateDuration() {
		if (unit === 'unlimited') {
			value = 0;
			durationInSeconds = undefined;
			return;
		}
		const mult = durationMultipliers[unit];
		durationInSeconds = value * (mult || 1);
	}

	function handleUnitChange(selected: string | undefined) {
		if (selected) {
			unit = selected;
			updateDuration();
		}
	}

	function handleValueChange(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseInt(target.value) || 0;
		updateDuration();
	}
</script>

<div class="flex space-x-2 items-center">
	<Select.Root type="single" value={unit} onValueChange={handleUnitChange}>
		<Select.Trigger class="w-28">
			{selectedLabel}
		</Select.Trigger>
		<Select.Content>
			{#each durationUnits as option}
				<Select.Item value={option.value}>{option.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Input
		type="number"
		{value}
		onchange={handleValueChange}
		min={1}
		step={1}
		disabled={unit === 'unlimited'}
		class="flex-1"
	/>
</div>
