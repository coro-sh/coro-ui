<script lang="ts">
	import type { AccountStat } from '$lib/models/entity';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import TabCard from '$lib/components/ui/tab/TabCard.svelte';
	import Activity from '@lucide/svelte/icons/activity';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Send from '@lucide/svelte/icons/send';
	import Download from '@lucide/svelte/icons/download';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Network from '@lucide/svelte/icons/network';
	import Zap from '@lucide/svelte/icons/zap';

	interface Props {
		stats?: AccountStat;
		loading?: boolean;
	}

	let { stats, loading = false }: Props = $props();

	// Use zero values if stats are not available
	const displayStats = $derived(
		stats ?? {
			conns: 0,
			total_conns: 0,
			leafnodes: 0,
			num_subscriptions: 0,
			slow_consumers: 0,
			sent: { bytes: 0, msgs: 0 },
			received: { bytes: 0, msgs: 0 },
		}
	);

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}
</script>

<div class="space-y-6">
	{#if loading}
		<TabCard>
			<div class="mb-4">
				<Skeleton class="h-8 w-48" />
			</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each { length: 8 } as _}
					<div class="border-border bg-muted/60 rounded-lg border p-4">
						<Skeleton class="mb-2 h-4 w-24" />
						<Skeleton class="h-8 w-32" />
					</div>
				{/each}
			</div>
		</TabCard>
	{:else}
		<TabCard>
			<div class="mb-4">
				<h2 class="text-foreground text-xl font-semibold sm:text-2xl">Metrics</h2>
			</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Connections -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Activity class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Connections</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.conns)}
					</div>
				</div>

				<!-- Total Connections -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Activity class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Total Connections</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.total_conns)}
					</div>
				</div>

				<!-- Leaf Nodes -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Network class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Leaf Nodes</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.leafnodes)}
					</div>
				</div>

				<!-- Subscriptions -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<TrendingUp class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Subscriptions</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.num_subscriptions)}
					</div>
				</div>

				<!-- Slow Consumers -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<AlertTriangle class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Slow Consumers</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.slow_consumers)}
					</div>
				</div>

				<!-- Sent -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Send class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Sent</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatBytes(displayStats.sent.bytes)}
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{formatNumber(displayStats.sent.msgs)} messages
					</div>
				</div>

				<!-- Received -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Download class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Received</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatBytes(displayStats.received.bytes)}
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{formatNumber(displayStats.received.msgs)} messages
					</div>
				</div>

				<!-- Total Messages -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Zap class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Total Messages</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(displayStats.sent.msgs + displayStats.received.msgs)}
					</div>
				</div>
			</div>
		</TabCard>
	{/if}
</div>
