<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Badge } from '$lib/components/ui/badge';
	import TabCard from '$lib/components/ui/tab/TabCard.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { ServerStatsMsg, OperatorResponse } from '$lib/models/entity';
	import Activity from '@lucide/svelte/icons/activity';
	import Users from '@lucide/svelte/icons/users';
	import Cpu from '@lucide/svelte/icons/cpu';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import Clock from '@lucide/svelte/icons/clock';
	import Database from '@lucide/svelte/icons/database';
	import Send from '@lucide/svelte/icons/send';
	import Download from '@lucide/svelte/icons/download';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Circle from '@lucide/svelte/icons/circle';

	interface Props {
		loading: boolean;
		stats: ServerStatsMsg | undefined;
		operator: OperatorResponse | undefined;
	}

	let { loading = $bindable(), stats = $bindable(), operator = $bindable() }: Props = $props();

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat().format(num);
	}

	function formatUptime(startTime: string): string {
		const start = new Date(startTime).getTime();
		const now = Date.now();
		const diff = now - start;
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		if (days > 0) return `${days}d ${hours}h`;
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m`;
	}

	function truncate(text: string, maxLength: number = 30): string {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
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
	{:else if stats}
		<!-- Server Info -->
		<TabCard>
			<div class="mb-4 flex items-center gap-2">
				<h2 class="text-foreground text-xl font-semibold sm:text-2xl">NATS Server</h2>
				{#if operator?.status.connected}
					<Badge variant="success" class="mt-0.5 flex items-center gap-1">
						<Circle class="size-1.5! fill-current" />
						Connected
					</Badge>
				{/if}
			</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#if stats.server.name !== stats.server.id}
						<div>
							<div class="text-muted-foreground mb-1 text-sm">Name</div>
							{#if stats.server.name.length > 25}
								<Tooltip.Root delayDuration={100}>
									<Tooltip.Trigger class="text-foreground cursor-help font-mono text-sm">
										{truncate(stats.server.name, 25)}
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="max-w-xs break-all">{stats.server.name}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							{:else}
								<div class="text-foreground font-mono text-sm">{stats.server.name}</div>
							{/if}
						</div>
					{/if}
					<div>
						<div class="text-muted-foreground mb-1 text-sm">Server ID</div>
						{#if stats.server.id.length > 25}
							<Tooltip.Root delayDuration={100}>
								<Tooltip.Trigger class="text-foreground cursor-help font-mono text-sm">
									{truncate(stats.server.id, 25)}
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p class="max-w-xs break-all">{stats.server.id}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{:else}
							<div class="text-foreground font-mono text-sm">{stats.server.id}</div>
						{/if}
					</div>
					<div>
						<div class="text-muted-foreground mb-1 text-sm">Version</div>
						<div class="text-foreground font-mono text-sm">{stats.server.ver}</div>
					</div>
					<div>
						<div class="text-muted-foreground mb-1 text-sm">JetStream</div>
						<div class="text-foreground font-mono text-sm">
							{stats.server.jetstream ? 'Enabled' : 'Disabled'}
						</div>
					</div>
					{#if stats.server.cluster}
						<div>
							<div class="text-muted-foreground mb-1 text-sm">Cluster</div>
							<div class="text-foreground font-mono text-sm">{stats.server.cluster}</div>
						</div>
					{/if}
					{#if stats.server.domain}
						<div>
							<div class="text-muted-foreground mb-1 text-sm">Domain</div>
							<div class="text-foreground font-mono text-sm">{stats.server.domain}</div>
						</div>
					{/if}
			</div>
		</TabCard>

		<!-- Metrics -->
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
						{formatNumber(stats.statsz.connections)}
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{formatNumber(stats.statsz.total_connections)} total
					</div>
				</div>

				<!-- Accounts -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Users class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Active Accounts</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(stats.statsz.active_accounts)}
					</div>
				</div>

				<!-- Subscriptions -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<TrendingUp class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Subscriptions</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatNumber(stats.statsz.subscriptions)}
					</div>
				</div>

				<!-- Uptime -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Clock class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Uptime</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatUptime(stats.statsz.start)}
					</div>
				</div>

				<!-- CPU -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Cpu class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">CPU Usage</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{stats.statsz.cpu.toFixed(1)}%
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{stats.statsz.cores} {stats.statsz.cores === 1 ? 'core' : 'cores'}
					</div>
				</div>

				<!-- Memory -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<HardDrive class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Memory</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatBytes(stats.statsz.mem)}
					</div>
					{#if stats.statsz.gomemlimit}
						<div class="text-muted-foreground mt-1 text-xs">
							Limit: {formatBytes(stats.statsz.gomemlimit)}
						</div>
					{/if}
				</div>

				<!-- Sent -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Send class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Sent</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatBytes(stats.statsz.sent.bytes)}
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{formatNumber(stats.statsz.sent.msgs)} messages
					</div>
				</div>

				<!-- Received -->
				<div class="border-border bg-muted/60 rounded-lg border p-4">
					<div class="mb-2 flex items-center gap-2">
						<Download class="text-primary size-4" />
						<span class="text-muted-foreground text-sm">Received</span>
					</div>
					<div class="text-foreground text-2xl font-bold">
						{formatBytes(stats.statsz.received.bytes)}
					</div>
					<div class="text-muted-foreground mt-1 text-xs">
						{formatNumber(stats.statsz.received.msgs)} messages
					</div>
				</div>
			</div>
		</TabCard>

		<!-- Routes & Gateways -->
		{#if stats.statsz.routes && stats.statsz.routes.length > 0}
			<TabCard>
				<div class="mb-4">
					<h2 class="text-foreground text-xl font-semibold sm:text-2xl">Routes</h2>
				</div>
				<div class="border-border overflow-hidden rounded-lg border">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="border-border border-b">
								<tr class="text-muted-foreground text-left text-sm">
									<th class="p-4 font-medium">Route ID</th>
									<th class="p-4 font-medium">Name</th>
									<th class="p-4 font-medium">Sent</th>
									<th class="p-4 font-medium">Received</th>
									<th class="p-4 font-medium">Pending</th>
								</tr>
							</thead>
							<tbody>
								{#each stats.statsz.routes as route}
									<tr class="border-border border-b last:border-0">
										<td class="text-foreground p-4 font-mono text-sm">{route.rid}</td>
										<td class="text-foreground p-4 text-sm">{route.name || '-'}</td>
										<td class="text-foreground p-4 text-sm">
											{formatBytes(route.sent.bytes)} ({formatNumber(route.sent.msgs)})
										</td>
										<td class="text-foreground p-4 text-sm">
											{formatBytes(route.received.bytes)} ({formatNumber(route.received.msgs)})
										</td>
										<td class="text-foreground p-4 text-sm">{formatNumber(route.pending)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</TabCard>
		{/if}

		{#if stats.statsz.gateways && stats.statsz.gateways.length > 0}
			<TabCard>
				<div class="mb-4">
					<h2 class="text-foreground text-xl font-semibold sm:text-2xl">Gateways</h2>
				</div>
				<div class="border-border overflow-hidden rounded-lg border">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="border-border border-b">
								<tr class="text-muted-foreground text-left text-sm">
									<th class="p-4 font-medium">Gateway ID</th>
									<th class="p-4 font-medium">Name</th>
									<th class="p-4 font-medium">Sent</th>
									<th class="p-4 font-medium">Received</th>
									<th class="p-4 font-medium">Inbound Connections</th>
								</tr>
							</thead>
							<tbody>
								{#each stats.statsz.gateways as gateway}
									<tr class="border-border border-b last:border-0">
										<td class="text-foreground p-4 font-mono text-sm">{gateway.gwid}</td>
										<td class="text-foreground p-4 text-sm">{gateway.name}</td>
										<td class="text-foreground p-4 text-sm">
											{formatBytes(gateway.sent.bytes)} ({formatNumber(gateway.sent.msgs)})
										</td>
										<td class="text-foreground p-4 text-sm">
											{formatBytes(gateway.received.bytes)} ({formatNumber(
												gateway.received.msgs
											)})
										</td>
										<td class="text-foreground p-4 text-sm">
											{formatNumber(gateway.inbound_connections)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</TabCard>
		{/if}
	{:else}
		<div class="text-muted-foreground text-center">No stats available</div>
	{/if}
</div>
