<script lang="ts">
	import type { UserResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/ui/entity/EntityOverview.svelte';
	import EditUserModal from '$lib/components/ui/user/EditUserModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { formatDuration } from '$lib/utils';

	interface Props {
		user: UserResponse;
		loading?: boolean;
		accountUserJWTLifetime?: number;
	}

	let { user = $bindable(), loading = $bindable(true), accountUserJWTLifetime }: Props = $props();

	let openEditModal = $state(false);

	const copyableFields = ['ID', 'Public Key'];
	const userFields = ['ID', 'Public Key'] as const;
	const limitFields = ['Subscriptions', 'Payload Size (KiB)', 'JWT Lifetime'] as const;

	const userData = $derived.by(() => {
		const data = new Map<(typeof userFields)[number], unknown>();
		if (user) {
			data.set('ID', user.id);
			data.set('Public Key', user.public_key);
		} else {
			for (const field of userFields) {
				data.set(field, 'Unknown');
			}
		}
		return data;
	});

	const userLimits = $derived.by(() => {
		const limits = new Map<(typeof limitFields)[number], unknown>();
		if (user) {
			const formatLimit = (val: number | undefined) => (val === -1 ? undefined : val);
			limits.set('Subscriptions', formatLimit(user.limits.subscriptions));
			limits.set('Payload Size (KiB)', formatLimit(user.limits.payload_size));

			const jwtLifetime = accountUserJWTLifetime
				? `${formatDuration(accountUserJWTLifetime)} (account limit)`
				: formatDuration(user.limits.jwt_duration_secs);
			limits.set('JWT Lifetime', jwtLifetime);
		} else {
			for (const field of limitFields) {
				limits.set(field, 'Unknown');
			}
		}
		return limits;
	});

	async function deleteCallback() {
		await new CoroClient().deleteUser(user.id);
		await goto(
			`/namespaces/${namespaceStore.activeId}/operators/${user.operator_id}/${user.account_id}?tab=2`
		);
	}
</script>

<EntityOverview
	bind:loading
	bind:openEditModal
	editable={true}
	name={user?.name}
	{copyableFields}
	data={userData}
	limits={userLimits}
	{deleteCallback}
/>

{#if user}
	<EditUserModal bind:open={openEditModal} bind:user {accountUserJWTLifetime} />
{/if}
