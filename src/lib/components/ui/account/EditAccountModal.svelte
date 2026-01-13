<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountLimits, AccountResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import AccountLimitsFormInput from '$lib/components/ui/account/AccountLimitsFormInput.svelte';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
		account: AccountResponse;
	}

	let { open = $bindable(false), account = $bindable() }: Props = $props();

	let loading = $state(false);
	let name = $state(account.name);
	let limits = $state<AccountLimits>(
		account.limits
			? {
					subscriptions: account.limits.subscriptions,
					payload_size: account.limits.payload_size,
					imports: account.limits.imports,
					exports: account.limits.exports,
					connections: account.limits.connections,
					user_jwt_duration_secs: account.limits.user_jwt_duration_secs,
				}
			: {}
	);

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			account = await client.updateAccount(account.id, {
				name: name,
				limits: limits,
			});
			open = false;
		} catch (e) {
			showError(e as Error);
		} finally {
			loading = false;
		}
	}
</script>

<EntityModal
	bind:open
	bind:loading
	entityType="account"
	modalType="edit"
	entityName={account.name}
	onsubmit={handleSubmit}
>
	<h3 class="col-span-2 text-lg font-medium">General</h3>
	<div class="col-span-2">
		<Label for="name" class="mb-2">Name</Label>
		<Input bind:value={name} name="name" placeholder="Type account name" required />
	</div>

	<Separator class="col-span-2 my-2" />

	<AccountLimitsFormInput bind:limits />
</EntityModal>
