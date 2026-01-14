<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	const user = $derived(authStore.user);
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
							<span class="text-sm">Namespaces</span>
							<span class="font-mono text-sm font-medium">{user.plan.limits.namespaces}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">Operators</span>
							<span class="font-mono text-sm font-medium">{user.plan.limits.operators}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">Accounts</span>
							<span class="font-mono text-sm font-medium">{user.plan.limits.accounts}</span>
						</div>
					</div>
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
