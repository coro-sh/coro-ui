import type { Response, ResponsePage, ResponsePageData } from '$lib/models/entity';
import {
	newDetailsError,
	newError,
	newNetworkError,
	newResponseError,
	newUnexpectedNoContentResponse,
	newUnsupportedResponseContentTypeError,
	newUnsupportedResponseError
} from '$lib/error';

export class Client {
	private readonly baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const response = await this.fetch(path, options);

		const contentType = response.headers.get('Content-Type') || '';

		if (contentType.includes('application/json')) {
			const body: Response<T> = await response.json().catch(() => null);
			if (!response.ok) {
				this.handleErrorBody(response.status, response.statusText, body);
			}

			if (body && 'data' in body) {
				return body.data;
			}

			throw newUnsupportedResponseError();
		}

		if (contentType.includes('text/plain')) {
			const text = await response.text().catch(() => '');
			if (!response.ok) {
				throw newResponseError(response.status, response.statusText);
			}
			return text as T;
		}

		throw newUnsupportedResponseContentTypeError(contentType);
	}

	async requestNoContent(path: string, options: RequestInit = {}): Promise<void> {
		const response = await this.fetch(path, options);
		if (!response.ok) {
			throw newResponseError(response.status, response.statusText);
		}
		if (response.status === 204) {
			return;
		}
		throw newUnexpectedNoContentResponse(response.status);
	}

	async download(path: string, fallbackFilename: string, options: RequestInit = {}) {
		const response = await this.fetch(path, options);

		const contentType = response.headers.get('Content-Type') || '';

		if (!contentType.includes('text/plain')) {
			throw newUnsupportedResponseContentTypeError(contentType);
		}

		const contentDisposition = response.headers.get('Content-Disposition');
		const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
		const filename = filenameMatch ? filenameMatch[1] : fallbackFilename;

		const blob = await response.blob();
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	async requestPage<T>(path: string, options: RequestInit = {}): Promise<ResponsePageData<T>> {
		const response = await this.fetch(path, options);

		const contentType = response.headers.get('Content-Type') || '';

		if (!contentType.includes('application/json')) {
			throw newUnsupportedResponseContentTypeError(contentType);
		}

		const body: ResponsePage<T> = await response.json().catch(() => null);

		if (!response.ok) {
			this.handleErrorBody(response.status, response.statusText, body);
		}

		if (body && 'data' in body) {
			return body;
		}

		throw newUnsupportedResponseError();
	}

	private async fetch(path: string, options: RequestInit): Promise<globalThis.Response> {
		const url = `${this.baseURL}${path}`;
		const mergedOptions: RequestInit = {
			credentials: 'include',
			headers: {
				Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
				...(options.headers ?? {}),
			},
			...options,
		};

		try {
			return await fetch(url, mergedOptions);
		} catch (error) {
			throw newNetworkError(error);
		}
	}

	private handleErrorBody<T>(
		status: number,
		statusText: string,
		body: Response<T> | ResponsePage<T> | null
	): never {
		// Non-OK status: attempt to extract error from the body
		if (body && 'error' in body && body.error) {
			const { message, details } = body.error;
			const errorName = message;
			if (details && details.length > 0) {
				throw newDetailsError(errorName, details);
			}
			throw newError(errorName);
		} else {
			// Fallback error if no structured error body is available
			throw newResponseError(status, statusText);
		}
	}
}

export class Paginator<T> {
	private readonly client: Client;
	private readonly path: string;
	public size?: number;
	private cursor?: string;
	private hasNextPage: boolean = true;

	constructor(client: Client, endpoint: string, size?: number, cursor?: string) {
		this.client = client;
		this.path = endpoint;
		this.size = size;
		this.cursor = cursor;
	}

	async fetchNext(): Promise<T[]> {
		if (!this.hasNext()) {
			return [];
		}

		const searchParams = new URLSearchParams();

		if (this.size !== undefined || this.cursor !== undefined) {
			if (this.size !== undefined) {
				searchParams.append('page_size', this.size.toString());
			}
			if (this.cursor !== undefined) {
				searchParams.append('page_cursor', this.cursor.toString());
			}
		}

		const queryString = searchParams.toString();
		const path = queryString ? `${this.path}?${queryString}` : this.path;

		const response = await this.client.requestPage<T>(path);

		if (response.next_page_cursor) {
			this.cursor = response.next_page_cursor;
		} else {
			this.cursor = undefined;
			this.hasNextPage = false;
		}

		return response.data;
	}

	hasNext(): boolean {
		return this.hasNextPage;
	}

	reset(): void {
		this.cursor = undefined;
		this.hasNextPage = true;
	}
}
