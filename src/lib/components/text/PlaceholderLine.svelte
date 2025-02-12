<script lang="ts">
	export let width: '1/12' | '2/12' | '3/12' | '4/12' | '5/12' | '6/12' | '7/12' | '8/12' | '9/12' | '10/12' | '11/12' | '12/12' = '12/12';
</script>
<div role="status" class="animate-pulse h-2.5 bg-mono-500 rounded-full w-{width}"></div>
<span class="sr-only">Loading...</span>
