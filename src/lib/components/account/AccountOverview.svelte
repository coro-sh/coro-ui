<script lang="ts">
	import type { AccountResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/entity/EntityOverview.svelte';
	import EditAccountModal from '$lib/components/account/EditAccountModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';
	import { activeNamespaceId } from '$lib/stores/namespace';
	import { formatDuration } from '$lib/util';

	export let loading: boolean;
	export let account: AccountResponse;
	let openEditModal = false;

	const copyableFields = ['ID', 'Public Key'];

	const accountFields = ['ID', 'Public Key'] as const;
	let accountData: Map<typeof accountFields[number], any> = new Map();

	const limitFields = ['Subscriptions', 'Payload Size (KiB)', 'Imports', 'Exports', 'Connections', 'User JWT Lifetime'] as const;
	let accountLimits: Map<typeof limitFields[any], any> = new Map();


	for (const field of accountFields) {
		accountData.set(field, 'Unknown');
	}

	for (const field of limitFields) {
		accountLimits.set(field, 'Unknown');
	}

	$: if (account) {
		accountData = new Map(accountData); // trigger reactivity
		accountData.set('ID', account.id);
		accountData.set('Public Key', account.public_key);

		accountLimits = new Map(accountLimits);  // trigger reactivity
		accountLimits.set('Subscriptions', account.limits.subscriptions);
		accountLimits.set('Payload Size (KiB)', account.limits.payload_size);
		accountLimits.set('Imports', account.limits.imports);
		accountLimits.set('Exports', account.limits.exports);
		accountLimits.set('Connections', account.limits.connections);
		accountLimits.set('User JWT Lifetime', formatDuration(account.limits.user_jwt_duration_secs));

		accountLimits.forEach((value, key) => {
			if (value === -1) {
				accountLimits.set(key, 'Unlimited');
			}
		});
	}

	async function deleteCallback() {
		await new CoroClient().deleteAccount(account.id);
		await goto(`/namespaces/${$activeNamespaceId}/operators/${account.operator_id}?tab=3`);
	}
</script>

<EntityOverview bind:loading editable={true} bind:openEditModal name={account?.name} copyableFields={copyableFields}
								data={accountData}
								limits={accountLimits} jwt={account?.jwt} deleteCallback={deleteCallback} />

{#if account}
	<EditAccountModal bind:open={openEditModal} bind:account />
{/if}
