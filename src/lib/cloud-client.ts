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
}

export const cloudClient = new CloudClient();
