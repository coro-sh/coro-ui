<script lang="ts">
	import type { AccountResponse } from '$lib/models/entity';
	import EntityOverview from '$lib/components/ui/entity/EntityOverview.svelte';
	import EditAccountModal from '$lib/components/ui/account/EditAccountModal.svelte';
	import { CoroClient } from '$lib/coro-client';
	import { goto } from '$app/navigation';
	import { namespaceStore } from '$lib/stores/namespace.svelte';
	import { formatDuration } from '$lib/utils';

	interface Props {
		account: AccountResponse;
		loading?: boolean;
	}

	let { account = $bindable(), loading = $bindable(true) }: Props = $props();

	let openEditModal = $state(false);

	const copyableFields = ['ID', 'Public Key'];
	const accountFields = ['ID', 'Public Key'] as const;
	const limitFields = [
		'Subscriptions',
		'Payload Size (KiB)',
		'Imports',
		'Exports',
		'Connections',
		'User JWT Lifetime',
	] as const;

	const accountData = $derived.by(() => {
		const data = new Map<(typeof accountFields)[number], unknown>();
		if (account) {
			data.set('ID', account.id);
			data.set('Public Key', account.public_key);
		} else {
			for (const field of accountFields) {
				data.set(field, 'Unknown');
			}
		}
		return data;
	});

	const accountLimits = $derived.by(() => {
		const limits = new Map<(typeof limitFields)[number], unknown>();
		if (account) {
			const formatLimit = (val: number | undefined) => (val === -1 ? undefined : val);
			limits.set('Subscriptions', formatLimit(account.limits.subscriptions));
			limits.set('Payload Size (KiB)', formatLimit(account.limits.payload_size));
			limits.set('Imports', formatLimit(account.limits.imports));
			limits.set('Exports', formatLimit(account.limits.exports));
			limits.set('Connections', formatLimit(account.limits.connections));
			limits.set('User JWT Lifetime', formatDuration(account.limits.user_jwt_duration_secs));
		} else {
			for (const field of limitFields) {
				limits.set(field, 'Unknown');
			}
		}
		return limits;
	});

	async function deleteCallback() {
		await new CoroClient().deleteAccount(account.id);
		await goto(`/namespaces/${namespaceStore.activeId}/operators/${account.operator_id}?tab=3`);
	}
</script>

<EntityOverview
	bind:loading
	editable={true}
	bind:openEditModal
	name={account?.name}
	{copyableFields}
	data={accountData}
	limits={accountLimits}
	jwt={account?.jwt}
	{deleteCallback}
/>

{#if account}
	<EditAccountModal bind:open={openEditModal} bind:account />
{/if}
