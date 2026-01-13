import type { NamespaceResponse } from '$lib/models/entity';

class NamespaceStore {
	namespaces = $state<NamespaceResponse[]>([]);
	activeId = $state<string | undefined>(undefined);
	loading = $state(false);

	get active(): NamespaceResponse | undefined {
		return this.namespaces.find((ns) => ns.id === this.activeId);
	}

	get activeName(): string {
		return this.active?.name ?? '';
	}

	getNamespaceName(id: string): string {
		return this.namespaces.find((ns) => ns.id === id)?.name ?? '';
	}

	setNamespaces(namespaces: NamespaceResponse[]) {
		this.namespaces = namespaces;
	}

	setActiveId(id: string | undefined) {
		this.activeId = id;
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}
}

export const namespaceStore = new NamespaceStore();
