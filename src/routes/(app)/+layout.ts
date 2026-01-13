import type { LayoutLoad } from './$types';
import { CoroClient } from '$lib/coro-client';
import { namespaceStore } from '$lib/stores/namespace.svelte';
import { toError } from '$lib/error';
import type { NamespaceResponse } from '$lib/models/entity';

// TODO: Add cloud integration
// import { IS_CLOUD } from '$lib/config/build-target';
// import { cloudClient } from '$lib/cloud-client';
// import type { CloudLimitsResponse } from '$lib/models/cloud_response';

export const ssr = false;

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
	// TODO: Add cloud integration
	// if (IS_CLOUD) {
	// 	let limits: CloudLimitsResponse | null = null;
	// 	try {
	// 		limits = await cloudClient.fetchLimits();
	// 	} catch {
	// 		cloudClient.login();
	// 	}
	// 	const { namespaces, error } = await loadNamespaces();
	// 	return { namespaces, limits, error };
	// }

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
