<script lang="ts">
	import { CoroClient } from '$lib/coro-client';
	import type { AccountLimits, AccountResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import AccountLimitsFormInput from '$lib/components/account/AccountLimitsFormInput.svelte';
	import { Heading, Input, Label } from 'flowbite-svelte';
	import Divider from '$lib/components/layout/Divider.svelte';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let account: AccountResponse;

	let loading = false;
	let name = account.name;
	let limits: AccountLimits = {};

	if (account.limits) {
		limits = {
			subscriptions: account.limits.subscriptions,
			payload_size: account.limits.payload_size,
			imports: account.limits.imports,
			exports: account.limits.exports,
			connections: account.limits.connections,
			user_jwt_duration_secs: account.limits.user_jwt_duration_secs
		};
	}

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			account = await client.updateAccount(account.id, {
				name: name,
				limits: limits
			});
			open = false;
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="account" modalType="edit" entityName={account.name}>
		<Heading tag="h3" class="col-span-2 text-lg font-medium">
			General
		</Heading>
		<div class="col-span-2">
			<Label for="name" class="mb-2">Name</Label>
			<Input bind:value={name} name="name" placeholder="Type account name" required />
		</div>

		<Divider marginY={2} />

		<AccountLimitsFormInput bind:limits />
	</EntityModal>
</form>
