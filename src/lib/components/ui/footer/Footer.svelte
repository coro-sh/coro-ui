<script lang="ts">
	import { IS_CLOUD } from '$lib/config/build-target';
</script>

{#if IS_CLOUD}
	<footer class="bg-background fixed right-0 bottom-0 left-0 z-30 border-t py-2">
		<div class="text-muted-foreground flex items-center justify-center gap-4 text-xs">
			<a href="/terms" class="hover:text-foreground transition-colors">Terms of Service</a>
			<span class="text-border">|</span>
			<a href="/privacy" class="hover:text-foreground transition-colors">Privacy Policy</a>
			<span class="text-border">|</span>
			<span>&copy; {new Date().getFullYear()} Coro</span>
		</div>
	</footer>
{/if}
