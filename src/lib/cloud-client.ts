import { Client } from '$lib/http';
import { API_BASE_URL } from '$lib/config/api-base-url';
import type { CloudLimitsResponse, CloudMeResponse } from '$lib/models/cloud';

export class CloudClient {
	private readonly client: Client;

	constructor() {
		this.client = new Client(API_BASE_URL);
	}

	login(): void {
		window.location.href = API_BASE_URL + '/auth/login';
	}

	logout(): void {
		window.location.href = API_BASE_URL + '/auth/logout';
	}

	async fetchMe(): Promise<CloudMeResponse> {
		return this.client.request<CloudMeResponse>('/me', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
	}

	async fetchLimits(): Promise<CloudLimitsResponse> {
		return this.client.request<CloudLimitsResponse>('/me/limits', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
	}

	async updateProfile(name: string): Promise<CloudMeResponse> {
		return this.client.request<CloudMeResponse>('/me', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name }),
		});
	}

	async deleteAccount(): Promise<void> {
		await this.client.requestNoContent('/me', {
			method: 'DELETE',
		});
		// Session is already cleared on backend, redirect directly to login
		window.location.href = API_BASE_URL + '/auth/login';
	}
}

export const cloudClient = new CloudClient();
