<script lang="ts">
	import { Heading, Input, Label } from 'flowbite-svelte';
	import type { AccountLimits } from '$lib/models/entity';
	import DurationInput from '$lib/components/input/DurationInput.svelte';

	export let limits: AccountLimits = {};

	const limitFields: Array<{ key: keyof AccountLimits; label: string }> = [
		{ key: 'subscriptions', label: 'Subscriptions' },
		{ key: 'payload_size', label: 'Payload Size (KiB)' },
		{ key: 'imports', label: 'Imports' },
		{ key: 'exports', label: 'Exports' },
		{ key: 'connections', label: 'Connections' },
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
	<Label class="mb-2">User JWT Lifetime</Label>
	<DurationInput bind:durationInSeconds={limits.user_jwt_duration_secs}/>
</div>

