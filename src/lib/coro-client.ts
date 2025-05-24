import type {
	AccountResponse,
	CreateAccountRequest,
	CreateUserRequest,
	NamespaceResponse,
	OperatorProxyTokenResponse,
	OperatorResponse,
	OperatorStatus, StreamResponse,
	UpdateAccountRequest,
	UpdateUserRequest,
	UserIssuanceResponse,
	UserResponse
} from '$lib/models/entity';
import { Client, Paginator } from '$lib/http';
import { activeNamespaceId } from '$lib/stores/namespace';
import { get } from 'svelte/store';

function getAPIBaseURL(): string {
	const baseURL = import.meta.env.VITE_API_ADDRESS;
	return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
}

export class CoroClient {
	private readonly client: Client;

	constructor() {
		const apiBaseURL = getAPIBaseURL();
		this.client = new Client(apiBaseURL + '/api/v1');
	}

	// Namespace methods

	async createNamespace(name: string): Promise<NamespaceResponse> {
		return this.client.request<NamespaceResponse>('/namespaces', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});
	}

	paginateNamespaces(size?: number, cursor?: string): Paginator<NamespaceResponse> {
		return new Paginator<NamespaceResponse>(this.client, '/namespaces', size, cursor);
	}

	async deleteNamespace(namespaceId: string): Promise<void> {
		return this.client.requestNoContent(`/namespaces/${namespaceId}`, {
			method: 'DELETE'
		});
	}

	// Operator methods

	async createOperator(name: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${get(activeNamespaceId)}/operators`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			}
		);
	}

	async updateOperatorName(operatorId: string, name: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			}
		);
	}

	async fetchOperator(operatorId: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	async fetchNATSConfigContent(operatorId: string): Promise<string> {
		return this.client.request<string>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}/nats-config`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'text/plain' }
			}
		);
	}

	paginateOperators(size?: number, cursor?: string): Paginator<OperatorResponse> {
		return new Paginator<OperatorResponse>(
			this.client,
			`/namespaces/${get(activeNamespaceId)}/operators`,
			size,
			cursor
		);
	}

	async deleteOperator(operatorId: string): Promise<void> {
		return this.client.requestNoContent(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}`,
			{
				method: 'DELETE'
			}
		);
	}

	// Account methods

	async createAccount(operatorId: string, req: CreateAccountRequest): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}/accounts`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req)
			}
		);
	}

	async updateAccount(accountId: string, req: UpdateAccountRequest): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req)
			}
		);
	}

	async fetchAccount(accountId: string): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	paginateAccounts(operatorId: string, size?: number, cursor?: string): Paginator<AccountResponse> {
		return new Paginator<AccountResponse>(
			this.client,
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}/accounts`,
			size,
			cursor
		);
	}

	async deleteAccount(accountId: string): Promise<void> {
		return this.client.requestNoContent(
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}`,
			{
				method: 'DELETE'
			}
		);
	}

	// User methods

	async createUser(accountId: string, req: CreateUserRequest): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}/users`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req)
			}
		);
	}

	async updateUser(userId: string, req: UpdateUserRequest): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${get(activeNamespaceId)}/users/${userId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req)
			}
		);
	}

	async fetchUser(userId: string): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${get(activeNamespaceId)}/users/${userId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	async downloadUserCreds(userId: string) {
		await this.client.download(
			`/namespaces/${get(activeNamespaceId)}/users/${userId}/creds`,
			`${userId}.creds`
		);
	}

	paginateUsers(accountId: string, size?: number, cursor?: string): Paginator<UserResponse> {
		return new Paginator<UserResponse>(
			this.client,
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}/users`,
			size,
			cursor
		);
	}

	async deleteUser(userId: string): Promise<void> {
		return this.client.requestNoContent(`/namespaces/${get(activeNamespaceId)}/users/${userId}`, {
			method: 'DELETE'
		});
	}

	paginateUserIssuances(
		userId: string,
		size?: number,
		cursor?: string
	): Paginator<UserIssuanceResponse> {
		return new Paginator<UserIssuanceResponse>(
			this.client,
			`/namespaces/${get(activeNamespaceId)}/users/${userId}/issuances`,
			size,
			cursor
		);
	}

	// Proxy methods

	async createOperatorProxyToken(operatorId: string): Promise<OperatorProxyTokenResponse> {
		return this.client.request<OperatorProxyTokenResponse>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}/proxy/token`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: null
			}
		);
	}

	async getOperatorProxyStatus(operatorId: string): Promise<OperatorStatus> {
		return this.client.request<OperatorStatus>(
			`/namespaces/${get(activeNamespaceId)}/operators/${operatorId}/proxy/status`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				body: null
			}
		);
	}

	// JetStream methods

	async listStreams(accountId: string): Promise<StreamResponse[]> {
		return this.client.request<StreamResponse[]>(
			`/namespaces/${get(activeNamespaceId)}/accounts/${accountId}/streams`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
