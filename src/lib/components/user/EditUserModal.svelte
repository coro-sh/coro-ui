<script lang="ts">
	import { CoroClient } from '$lib/coro-client';
	import type { UserLimits, UserResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/entity/EntityModal.svelte';
	import UserLimitsFormInput from '$lib/components/user/UserLimitsFormInput.svelte';
	import { Heading, Input, Label } from 'flowbite-svelte';
	import Divider from '$lib/components/layout/Divider.svelte';
	import { showErrorToast } from '$lib/stores/toast';

	export let open: boolean = false;
	export let user: UserResponse;
	export let accountUserJWTLifetime: number | undefined;

	let loading = false;
	let name = user.name;
	let limits: UserLimits = {};

	if (user.limits) {
		limits = {
			subscriptions: user.limits.subscriptions,
			payload_size: user.limits.payload_size,
			jwt_duration_secs: user.limits.jwt_duration_secs
		};
	}

	const client = new CoroClient();

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		try {
			loading = true;
			user = await client.updateUser(user.id, {
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
	<EntityModal bind:open bind:loading entityType="user" modalType="edit" entityName={user.name}>
		<Heading tag="h3" class="col-span-2 text-lg font-medium">
			General
		</Heading>
		<div class="col-span-2">
			<Label for="name" class="mb-2">Name</Label>
			<Input bind:value={name} name="name" placeholder="Type user name" required />
		</div>

		<Divider marginY={2} />

		<UserLimitsFormInput bind:limits accountUserJWTLifetime={accountUserJWTLifetime}/>
	</EntityModal>
</form>
