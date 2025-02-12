<script lang="ts">
	import { upperCaseFirstChar } from '$lib/util';
	import Modal from '$lib/components/modal/Modal.svelte';

	export let open: boolean = false;
	export let loading = false;
	export let entityType: 'namespace' | 'operator' | 'account' | 'user';
	export let modalType: 'create' | 'edit';
	export let entityName: string | null = null;

	const title = `${upperCaseFirstChar(modalType)} ${entityName ?? upperCaseFirstChar(entityType)}`;
	const submitText = modalType === 'create' ? 'Create' : 'Save';
</script>

<Modal bind:open
			 bind:loading
			 title={title}
			 submitButtonText={submitText}>
	<slot />
</Modal>
