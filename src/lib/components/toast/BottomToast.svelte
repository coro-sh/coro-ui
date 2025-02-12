<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Toast } from 'flowbite-svelte';
	import { afterUpdate, onDestroy } from 'svelte';

	export let toastStatus: boolean;
	export let backgroundColor: 'primary' | 'red' = 'primary';
	export let textColor = 'mono' as const;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'xl';
	export let dismissable = false;
	export let clearDuration = 2000;

	const toastClass = `p-3 shadow rounded max-w-${size} bg-${backgroundColor}-600 dark:bg-${backgroundColor}-800 text-${textColor}-100 dark:text-${textColor}-100`;
	const iconClass = `w-8 h-8 bg-${backgroundColor}-600 dark:bg-${backgroundColor}-800 text-${textColor}-100 dark:text-${textColor}-100`;

	let timeoutId: number | null = null;

	afterUpdate(() => {
		if (toastStatus) {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				toastStatus = false;
				timeoutId = null;
			}, clearDuration);
		}
	});

	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
</script>

<div class="fixed inset-x-0 bottom-4 z-50 flex justify-center">
	<Toast
		divClass={toastClass}
		defaultIconClass={iconClass}
		dismissable={dismissable}
		transition={slide}
		bind:toastStatus>
		<slot name="icon" slot="icon" />
		<slot />
	</Toast>
</div>
