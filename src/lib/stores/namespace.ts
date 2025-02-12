import { get, type Writable, writable } from 'svelte/store';
import type { NamespaceResponse } from '$lib/models/entity';

export const namespacesLoading: Writable<boolean> = writable(false);
export const namespaces: Writable<NamespaceResponse[]> = writable([]);

export const activeNamespaceId: Writable<string> = writable();

export function getNamespaceName(id: string): string {
	const ns = get(namespaces).find(x => x.id === id);
	if (!ns) {
		return '';
	}
	return ns.name;
}

