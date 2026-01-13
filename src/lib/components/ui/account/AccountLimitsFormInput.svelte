<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { AccountLimits } from '$lib/models/entity';
	import DurationInput from '$lib/components/ui/input/DurationInput.svelte';

	interface Props {
		limits?: AccountLimits;
	}

	let { limits = $bindable({}) }: Props = $props();

	const limitFields: Array<{ key: keyof AccountLimits; label: string }> = [
		{ key: 'subscriptions', label: 'Subscriptions' },
		{ key: 'payload_size', label: 'Payload Size (KiB)' },
		{ key: 'imports', label: 'Imports' },
		{ key: 'exports', label: 'Exports' },
		{ key: 'connections', label: 'Connections' },
	];

	function handleLimitChange(key: keyof AccountLimits, e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value ? parseInt(target.value) : undefined;
		limits = { ...limits, [key]: value };
	}
</script>

<h3 class="col-span-2 text-lg font-medium">Limits</h3>

{#each limitFields as { key, label }}
	<div>
		<Label for={key} class="mb-2">{label}</Label>
		<Input
			type="number"
			value={limits[key] ?? ''}
			onchange={(e) => handleLimitChange(key, e)}
			name={key}
			placeholder="Unlimited"
			min={0}
			max={1000000}
		/>
	</div>
{/each}

<div>
	<Label class="mb-2">User JWT Lifetime</Label>
	<DurationInput bind:durationInSeconds={limits.user_jwt_duration_secs} />
</div>
