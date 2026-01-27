import type {
	AccountResponse,
	CreateAccountRequest,
	CreateUserRequest,
	NamespaceResponse,
	OperatorProxyTokenResponse,
	OperatorResponse,
	OperatorStatus,
	Stream,
	StreamMessage,
	StreamMessageContent,
	UpdateAccountRequest,
	UpdateUserRequest,
	UserIssuanceResponse,
	UserResponse,
} from '$lib/models/entity';
import { Client, Paginator } from '$lib/http';
import { namespaceStore } from '$lib/stores/namespace.svelte';
import { API_BASE_URL } from '$lib/config/api-base-url';

// Re-export Paginator for convenience
export { Paginator } from '$lib/http';
export type { Paginator as PaginatorType } from '$lib/http';

export class CoroClient {
	private readonly client: Client;

	constructor() {
		this.client = new Client(API_BASE_URL + '/api/v1');
	}

	// Namespace methods

	async createNamespace(name: string): Promise<NamespaceResponse> {
		return this.client.request<NamespaceResponse>('/namespaces', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name }),
		});
	}

	paginateNamespaces(size?: number, cursor?: string): Paginator<NamespaceResponse> {
		return new Paginator<NamespaceResponse>(this.client, '/namespaces', size, cursor);
	}

	async updateNamespace(namespaceId: string, name: string): Promise<NamespaceResponse> {
		return this.client.request<NamespaceResponse>(`/namespaces/${namespaceId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name }),
		});
	}

	async deleteNamespace(namespaceId: string): Promise<void> {
		return this.client.requestNoContent(`/namespaces/${namespaceId}`, {
			method: 'DELETE',
		});
	}

	// Operator methods

	async createOperator(name: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${namespaceStore.activeId}/operators`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			}
		);
	}

	async updateOperatorName(operatorId: string, name: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name }),
			}
		);
	}

	async fetchOperator(operatorId: string): Promise<OperatorResponse> {
		return this.client.request<OperatorResponse>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	async fetchNATSConfigContent(operatorId: string): Promise<string> {
		return this.client.request<string>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}/nats-config`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'text/plain' },
			}
		);
	}

	paginateOperators(size?: number, cursor?: string): Paginator<OperatorResponse> {
		return new Paginator<OperatorResponse>(
			this.client,
			`/namespaces/${namespaceStore.activeId}/operators`,
			size,
			cursor
		);
	}

	async deleteOperator(operatorId: string, unmanageAccounts?: boolean): Promise<void> {
		const params = new URLSearchParams();
		if (unmanageAccounts) {
			params.append('unmanage_accounts', 'true');
		}
		const queryString = params.toString();
		const url = `/namespaces/${namespaceStore.activeId}/operators/${operatorId}${queryString ? `?${queryString}` : ''}`;

		return this.client.requestNoContent(url, {
			method: 'DELETE',
		});
	}

	// Account methods

	async createAccount(operatorId: string, req: CreateAccountRequest): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}/accounts`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			}
		);
	}

	async updateAccount(accountId: string, req: UpdateAccountRequest): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			}
		);
	}

	async fetchAccount(accountId: string): Promise<AccountResponse> {
		return this.client.request<AccountResponse>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	paginateAccounts(operatorId: string, size?: number, cursor?: string): Paginator<AccountResponse> {
		return new Paginator<AccountResponse>(
			this.client,
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}/accounts`,
			size,
			cursor
		);
	}

	async deleteAccount(accountId: string, unmanage?: boolean): Promise<void> {
		const params = new URLSearchParams();
		if (unmanage) {
			params.append('unmanage', 'true');
		}
		const queryString = params.toString();
		const url = `/namespaces/${namespaceStore.activeId}/accounts/${accountId}${queryString ? `?${queryString}` : ''}`;

		return this.client.requestNoContent(url, {
			method: 'DELETE',
		});
	}

	// User methods

	async createUser(accountId: string, req: CreateUserRequest): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}/users`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			}
		);
	}

	async updateUser(userId: string, req: UpdateUserRequest): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${namespaceStore.activeId}/users/${userId}`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(req),
			}
		);
	}

	async fetchUser(userId: string): Promise<UserResponse> {
		return this.client.request<UserResponse>(
			`/namespaces/${namespaceStore.activeId}/users/${userId}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	async downloadUserCreds(userId: string) {
		await this.client.download(
			`/namespaces/${namespaceStore.activeId}/users/${userId}/creds`,
			`${userId}.creds`
		);
	}

	paginateUsers(accountId: string, size?: number, cursor?: string): Paginator<UserResponse> {
		return new Paginator<UserResponse>(
			this.client,
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}/users`,
			size,
			cursor
		);
	}

	async deleteUser(userId: string): Promise<void> {
		return this.client.requestNoContent(`/namespaces/${namespaceStore.activeId}/users/${userId}`, {
			method: 'DELETE',
		});
	}

	paginateUserIssuances(
		userId: string,
		size?: number,
		cursor?: string
	): Paginator<UserIssuanceResponse> {
		return new Paginator<UserIssuanceResponse>(
			this.client,
			`/namespaces/${namespaceStore.activeId}/users/${userId}/issuances`,
			size,
			cursor
		);
	}

	// Proxy methods

	async createOperatorProxyToken(operatorId: string): Promise<OperatorProxyTokenResponse> {
		return this.client.request<OperatorProxyTokenResponse>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}/proxy/token`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: null,
			}
		);
	}

	async getOperatorProxyStatus(operatorId: string): Promise<OperatorStatus> {
		return this.client.request<OperatorStatus>(
			`/namespaces/${namespaceStore.activeId}/operators/${operatorId}/proxy/status`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				body: null,
			}
		);
	}

	// Stream methods

	async listStreams(accountId: string): Promise<Stream[]> {
		return this.client.request<Stream[]>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}/streams`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	async fetchStream(accountId: string, streamName: string): Promise<Stream> {
		return this.client.request<Stream>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}/streams/${streamName}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	async fetchStreamMessages(
		accountId: string,
		streamName: string,
		startSequence?: number,
		batchSize?: number
	): Promise<StreamMessage[]> {
		const params = new URLSearchParams();
		if (startSequence !== undefined) {
			params.append('start_sequence', startSequence.toString());
		}
		if (batchSize !== undefined) {
			params.append('batch_size', batchSize.toString());
		}
		const queryString = params.toString();
		const path = `/namespaces/${namespaceStore.activeId}/accounts/${accountId}/streams/${streamName}/messages${queryString ? `?${queryString}` : ''}`;

		return this.client.request<StreamMessage[]>(path, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
	}

	async fetchStreamMessageContent(
		accountId: string,
		streamName: string,
		streamSequence: number
	): Promise<StreamMessageContent> {
		return this.client.request<StreamMessageContent>(
			`/namespaces/${namespaceStore.activeId}/accounts/${accountId}/streams/${streamName}/messages/${streamSequence}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
