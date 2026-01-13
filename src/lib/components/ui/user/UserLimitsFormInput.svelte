<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { UserLimits } from '$lib/models/entity';
	import DurationInput from '$lib/components/ui/input/DurationInput.svelte';
	import { formatDuration } from '$lib/utils';

	interface Props {
		limits?: UserLimits;
		accountUserJWTLifetime?: number;
	}

	let { limits = $bindable({}), accountUserJWTLifetime }: Props = $props();

	const limitFields: Array<{ key: keyof UserLimits; label: string }> = [
		{ key: 'subscriptions', label: 'Subscriptions' },
		{ key: 'payload_size', label: 'Payload Size (KiB)' },
	];

	function handleLimitChange(key: keyof UserLimits, e: Event) {
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
	<Label class="mb-2">JWT Lifetime</Label>
	{#if accountUserJWTLifetime}
		<Input value={`${formatDuration(accountUserJWTLifetime)} (account limit)`} disabled />
	{:else}
		<DurationInput bind:durationInSeconds={limits.jwt_duration_secs} />
	{/if}
</div>
