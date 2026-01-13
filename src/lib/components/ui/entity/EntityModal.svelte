<script lang="ts">
	import { upperCaseFirstChar } from '$lib/utils';
	import Modal from '$lib/components/ui/modal/Modal.svelte';
	import type { Snippet } from 'svelte';

	type EntityType = 'namespace' | 'operator' | 'account' | 'user';
	type ModalType = 'create' | 'edit';

	interface Props {
		open?: boolean;
		loading?: boolean;
		entityType: EntityType;
		modalType: ModalType;
		entityName?: string | null;
		onsubmit?: (e: SubmitEvent) => void;
		children: Snippet;
	}

	let {
		open = $bindable(false),
		loading = $bindable(false),
		entityType,
		modalType,
		entityName = null,
		onsubmit,
		children
	}: Props = $props();

	const title = $derived(
		`${upperCaseFirstChar(modalType)} ${entityName ?? upperCaseFirstChar(entityType)}`
	);
	const submitText = $derived(modalType === 'create' ? 'Create' : 'Save');
</script>

<Modal bind:open bind:loading {title} submitButtonText={submitText} {onsubmit}>
	{@render children()}
</Modal>
