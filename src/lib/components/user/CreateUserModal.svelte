<script lang="ts">
	import { Heading, Input, Label } from 'flowbite-svelte';
	import { CoroClient } from '$lib/coro-client';
	import type { AccountLimits, UserResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import Divider from '$lib/components/layout/Divider.svelte';
	import UserLimitsFormInput from '$lib/components/user/UserLimitsFormInput.svelte';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let accountId: string;
	export let users: UserResponse[];

	let loading = false;
	let name = '';
	let limits: AccountLimits = {};

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			const created = await client.createUser(accountId, { name, limits });
			users = [created, ...users];
			name = '';
			open = false;
		} catch (e) {
			showErrorToast(e);
		} finally {
			loading = false;
		}
	}
</script>

<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
	<EntityModal bind:open bind:loading entityType="user" modalType="create">
		<Heading tag="h3" class="col-span-2 text-lg font-medium">
			General
		</Heading>
		<div class="col-span-2">
			<Label for="name" class="mb-2">Name</Label>
			<Input bind:value={name} name="name" placeholder="Type account name" required />
		</div>

		<Divider marginY={2} />
		<UserLimitsFormInput bind:limits />
	</EntityModal>
</form>
