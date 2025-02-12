<script lang="ts">
	import { Heading, Input, Label } from 'flowbite-svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountLimits, AccountResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import ErrorToast from '$lib/components/toast/ErrorToast.svelte';
	import { toError } from '$lib/error';
	import Divider from '$lib/components/layout/Divider.svelte';
	import AccountLimitsFormInput from '$lib/components/account/AccountLimitsFormInput.svelte';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let operatorId: string;
	export let accounts: AccountResponse[];

	let loading = false;
	let name = '';
	let limits: AccountLimits = {};

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			const created = await client.createAccount(operatorId, { name, limits });
			accounts = [created, ...accounts];
			name = '';
			limits = {};
			open = false;
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="account" modalType="create">
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
