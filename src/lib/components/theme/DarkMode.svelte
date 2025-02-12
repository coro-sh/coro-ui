<!--
Adopted from https://github.com/themesberg/flowbite-svelte/discussions/1274#discussioncomment-9182547
-->
<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import { isDarkTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	const updateTheme = () => {
		isDarkTheme.set(document.documentElement.classList.contains('dark'));
	};

	onMount(() => {
		updateTheme();

		// Make a mutation observer to watch for class changes on ownerDocument.documentElement
		// and update the theme accordingly
		const darkModeObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					updateTheme();
				}
			});
		});
		// Observe changes to the class attribute of the ownerDocument.documentElement
		darkModeObserver.observe(document.documentElement, {
			attributes: true
		});
	});

</script>

<DarkMode />
