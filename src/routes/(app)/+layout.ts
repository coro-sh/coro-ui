import type { LayoutLoad } from './$types';
import { CoroClient } from '$lib/coro-client';
import { namespaceStore } from '$lib/stores/namespace.svelte';
import { authStore } from '$lib/stores/auth.svelte';
import { toError, UnauthorizedError } from '$lib/error';
import type { NamespaceResponse } from '$lib/models/entity';
import { IS_CLOUD } from '$lib/config/build-target';
import { cloudClient } from '$lib/cloud-client';
import type { CloudMeResponse } from '$lib/models/cloud';

async function loadNamespaces() {
	namespaceStore.setLoading(true);
	try {
		const client = new CoroClient();
		const paginator = client.paginateNamespaces(100);
		const page = await paginator.fetchNext();

		namespaceStore.setNamespaces(page);

		return { namespaces: page, error: undefined };
	} catch (e) {
		return { namespaces: [] as NamespaceResponse[], error: toError(e) };
	} finally {
		namespaceStore.setLoading(false);
	}
}

export const load: LayoutLoad = async ({ params }) => {
	if (IS_CLOUD) {
		authStore.setLoading(true);
		let user: CloudMeResponse | null = null;

		try {
			user = await cloudClient.fetchMe();
			authStore.setUser(user);
			authStore.setError(null);
		} catch (e) {
			const error = toError(e);

			// Only redirect to login if user is not authenticated (401)
			if (error instanceof UnauthorizedError) {
				authStore.setError('Please log in to continue');
				authStore.clear();
				cloudClient.login();
				return { namespaces: [], error, user: null };
			}

			// For other errors, log and show error but don't redirect
			console.error('Failed to fetch user:', error);
			authStore.setError(error.message);
			authStore.setUser(null);
		} finally {
			authStore.setLoading(false);
		}

		const { namespaces, error } = await loadNamespaces();

		// Set activeId from route params before components render
		if (params.namespace && namespaces.find((ns) => ns.id === params.namespace)) {
			namespaceStore.setActiveId(params.namespace);
		} else if (namespaces.length) {
			const defaultNS = namespaces.find((ns) => ns.name === 'default');
			namespaceStore.setActiveId(defaultNS?.id ?? namespaces[0].id);
		}

		return { namespaces, error, user };
	}

	const { namespaces, error } = await loadNamespaces();

	// Set activeId from route params before components render
	if (params.namespace && namespaces.find((ns) => ns.id === params.namespace)) {
		namespaceStore.setActiveId(params.namespace);
	} else if (namespaces.length) {
		const defaultNS = namespaces.find((ns) => ns.name === 'default');
		namespaceStore.setActiveId(defaultNS?.id ?? namespaces[0].id);
	}

	return { namespaces, error };
};
