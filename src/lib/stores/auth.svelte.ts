import type { CloudMeResponse } from '$lib/models/cloud';

class AuthStore {
	user = $state<CloudMeResponse | null>(null);
	loading = $state(false);
	error = $state<string | null>(null);

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	setUser(user: CloudMeResponse | null) {
		this.user = user;
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}

	setError(error: string | null) {
		this.error = error;
	}

	clear() {
		this.user = null;
		this.error = null;
		this.loading = false;
	}
}

export const authStore = new AuthStore();
