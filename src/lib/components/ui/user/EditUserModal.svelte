<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { CoroClient } from '$lib/coro-client';
	import type { UserLimits, UserResponse } from '$lib/models/entity';
	import EntityModal from '$lib/components/ui/entity/EntityModal.svelte';
	import UserLimitsFormInput from '$lib/components/ui/user/UserLimitsFormInput.svelte';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open?: boolean;
		user: UserResponse;
		accountUserJWTLifetime?: number;
	}

	let { open = $bindable(false), user = $bindable(), accountUserJWTLifetime }: Props = $props();

	let loading = $state(false);
	let name = $state(user.name);
	let limits = $state<UserLimits>(
		user.limits
			? {
					subscriptions: user.limits.subscriptions,
					payload_size: user.limits.payload_size,
					jwt_duration_secs: user.limits.jwt_duration_secs
				}
			: {}
	);

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
			showError(e as Error);
		} finally {
			loading = false;
		}
	}
</script>

<EntityModal
	bind:open
	bind:loading
	entityType="user"
	modalType="edit"
	entityName={user.name}
	onsubmit={handleSubmit}
>
	<h3 class="col-span-2 text-lg font-medium">General</h3>
	<div class="col-span-2">
		<Label for="name" class="mb-2">Name</Label>
		<Input bind:value={name} name="name" placeholder="Type user name" required />
	</div>

	<Separator class="col-span-2 my-2" />

	<UserLimitsFormInput bind:limits {accountUserJWTLifetime} />
</EntityModal>
