<script lang="ts">
	import { Heading, Input, Label } from 'flowbite-svelte';
	import type { UserLimits } from '$lib/models/entity';
	import DurationInput from '$lib/components/input/DurationInput.svelte';
	import { formatDuration } from '$lib/util';

	export let limits: UserLimits = {};
	export let accountUserJWTLifetime: number | undefined;

	const limitFields: Array<{ key: keyof UserLimits; label: string }> = [
		{ key: 'subscriptions', label: 'Subscriptions' },
		{ key: 'payload_size', label: 'Payload Size (KiB)' }
	];
</script>

<Heading tag="h3" class="col-span-2 text-lg font-medium">
	Limits
</Heading>

{#each limitFields as { key, label }}
	<div>
		<Label for={key} class="mb-2">{label}</Label>
		<Input let:props>
			<input type="number" {...props} bind:value={limits[key]} name={key} placeholder="Unlimited" min={0}
						 max={1000000} />
		</Input>
	</div>
{/each}

<div>
	<Label class="mb-2">JWT Lifetime</Label>
	{#if accountUserJWTLifetime}
		<Input value={`${formatDuration(accountUserJWTLifetime)} (account limit)`} disabled />

	{:else }
		<DurationInput bind:durationInSeconds={limits.jwt_duration_secs} />
	{/if}
</div>
