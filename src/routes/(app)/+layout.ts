import type { LayoutData, LayoutLoad } from './$types';
import { CoroClient } from '$lib/coro-client';
import { namespaces, namespacesLoading } from '$lib/stores/namespace';
import { toError } from '$lib/error';

export const ssr = false;

export const load: LayoutLoad = async function(): LayoutData {
	try {
		const client = new CoroClient();
		const paginator = client.paginateNamespaces(100);
		const page = await paginator.fetchNext();

		namespacesLoading.set(true)
		namespaces.set(page);

		return {
			namespaces: page
		};
	} catch (e) {
		return {
			namespaces: [],
			error: toError(e)
		};
	} finally {
		namespacesLoading.set(false)
	}
};

