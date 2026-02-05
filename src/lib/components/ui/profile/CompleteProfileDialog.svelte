<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { cloudClient } from '$lib/cloud-client';
	import { authStore } from '$lib/stores/auth.svelte';
	import { showError } from '$lib/stores/toast';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	let name = $state('');
	let submitting = $state(false);

	async function handleSubmit() {
		if (!name.trim()) return;

		try {
			submitting = true;
			const updatedUser = await cloudClient.updateProfile(name.trim());
			authStore.setUser(updatedUser);
			open = false;
		} catch (e) {
			showError(e as Error);
		} finally {
			submitting = false;
		}
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Tell us a bit about yourself</AlertDialog.Title>
			<AlertDialog.Description>
				Please provide your name to complete your profile setup.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<div class="space-y-4 py-4">
				<div class="space-y-2">
					<Label for="name">Name</Label>
					<Input
						id="name"
						type="text"
						placeholder="Enter your name"
						bind:value={name}
						disabled={submitting}
						required
						autofocus
					/>
				</div>
			</div>
			<AlertDialog.Footer>
				<Button type="submit" disabled={submitting || !name.trim()} class="min-w-24">
					{#if submitting}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						Continue
					{/if}
				</Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
