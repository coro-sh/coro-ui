<script lang="ts">
	import type { UserResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/entity/EntityOverview.svelte';
	import EditUserModal from '$lib/components/user/EditUserModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import { formatDuration } from '$lib/util';

	export let loading: boolean;
	export let user: UserResponse;
	export let accountUserJWTLifetime: number | undefined;

	let openEditModal = false;

	const copyableFields = ['ID', 'Public Key'];

	const userFields = ['ID', 'Public Key'] as const;
	let userData: Map<typeof userFields[any], any> = new Map();

	const limitFields = ['Subscriptions', 'Payload Size (KiB)', 'JWT Lifetime'] as const;
	let userLimits: Map<typeof limitFields[number], any> = new Map();

	for (const field of userFields) {
		userData.set(field, 'Unknown');
	}

	for (const field of limitFields) {
		userLimits.set(field, 'Unknown');
	}

	$: if (user) {
		userData = new Map(userData); // trigger reactivity
		userData.set('ID', user.id);
		userData.set('Public Key', user.public_key);

		userLimits = new Map(userLimits);  // trigger reactivity
		const limits = user.limits;
		userLimits.set('Subscriptions', limits.subscriptions);
		userLimits.set('Payload Size (KiB)', limits.payload_size);

		const userJWTLifetime = accountUserJWTLifetime ? `${formatDuration(accountUserJWTLifetime)} (account limit)` : formatDuration(user.limits.jwt_duration_secs);
		userLimits.set('JWT Lifetime', userJWTLifetime);
	}

	async function deleteCallback() {
		await new CoroClient().deleteUser(user.id);
		await goto(`/namespaces/${$activeNamespaceId}/operators/${user.operator_id}/${user.account_id}?tab=2`);
	}
</script>

<EntityOverview bind:loading
								bind:openEditModal
								editable={true}
								name={user?.name}
								copyableFields={copyableFields}
								data={userData}
								limits={userLimits}
								deleteCallback={deleteCallback}
/>

{#if user}
	<EditUserModal bind:open={openEditModal} bind:user accountUserJWTLifetime={accountUserJWTLifetime} />
{/if}
