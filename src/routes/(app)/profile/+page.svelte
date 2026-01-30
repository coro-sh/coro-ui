<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { cloudClient } from '$lib/cloud-client';
	import { showError } from '$lib/stores/toast';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	const user = $derived(authStore.user);
	let openDeleteDialog = $state(false);
	let deleting = $state(false);

	function formatLimit(value: number | undefined): string {
		if (value === undefined || value === null) return '-';
		return value === -1 ? 'Unlimited' : value.toString();
	}

	async function handleDeleteAccount() {
		try {
			deleting = true;
			await cloudClient.deleteAccount();
		} catch (e) {
			showError(e as Error);
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Profile - Coro</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tight">Account</h1>
		<p class="text-muted-foreground">Manage your account and view your plan details</p>
	</div>

	{#if user}
		<Card.Root>
			<Card.Header>
				<Card.Title>Details</Card.Title>
				<Card.Description>Your account details and contact information</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid gap-2">
					<div class="text-muted-foreground text-sm">Name</div>
					<div class="font-medium">{user.name}</div>
				</div>
				<div class="grid gap-2">
					<div class="text-muted-foreground text-sm">Email</div>
					<div class="font-medium">{user.email}</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Plan & Limits</Card.Title>
				<Card.Description>Your current plan and resource limits</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid gap-2">
					<div class="text-muted-foreground text-sm">Current Plan</div>
					<div>
						<Badge variant="default" class="text-base">{user.plan.name}</Badge>
					</div>
				</div>

				<div class="border-t pt-4">
					<div class="text-muted-foreground mb-3 text-sm font-medium">Resource Limits</div>
					<div class="grid gap-3">
						<div class="flex items-center justify-between">
							<span class="text-sm">Operators</span>
							<span class="font-mono text-sm font-medium">{formatLimit(user.plan.limits.operators)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">Accounts</span>
							<span class="font-mono text-sm font-medium">{formatLimit(user.plan.limits.accounts)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">Users</span>
							<span class="font-mono text-sm font-medium">{formatLimit(user.plan.limits.users)}</span>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="border-destructive">
			<Card.Header>
				<Card.Title class="text-destructive dark:text-red-700">Danger Zone</Card.Title>
				<Card.Description>Irreversible actions that will permanently affect your account</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-1">
						<div class="font-medium">Delete Account</div>
						<div class="text-muted-foreground text-sm">
							Permanently delete your account and all associated data
						</div>
					</div>
					<Button variant="destructive" onclick={() => (openDeleteDialog = true)}>
						Delete Account
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root>
			<Card.Content class="pt-6">
				<p class="text-muted-foreground">No user information available</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<AlertDialog.Root bind:open={openDeleteDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete your account and remove all your
				data from our servers, including:
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="bg-destructive/10 border-destructive/50 rounded-md border p-3">
			<div class="flex gap-2 items-start">
				<AlertTriangle class="text-destructive size-4 flex-shrink-0 mt-0.5" />
				<div class="text-sm space-y-1">
					<p class="font-medium">All of your data will be permanently deleted:</p>
					<ul class="text-muted-foreground list-disc list-inside space-y-0.5">
						<li>All namespaces</li>
						<li>All operators</li>
						<li>All accounts</li>
						<li>All users and credentials</li>
					</ul>
				</div>
			</div>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleDeleteAccount} disabled={deleting} class="min-w-32">
				{#if deleting}
					<LoaderCircle class="size-4 animate-spin" />
				{:else}
					Delete Account
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
