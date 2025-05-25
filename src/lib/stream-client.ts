import { get } from 'svelte/store';
import { activeNamespaceId } from '$lib/stores/namespace';
import type {
	ConsumerMessageResponse,
	ResponseData,
	StartStreamConsumerRequest
} from '$lib/models/entity';

const STREAM_SUBPROTOCOL = 'coro_stream';

function getWSBaseURL(): string {
	const baseURL = import.meta.env.VITE_WS_ADDRESS;
	return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
}

export class StreamConsumerWebSocketClient {
	private socket: WebSocket | null = null;

	constructor(
		private accountId: string,
		private streamName: string,
		private onMessage: (msg: ConsumerMessageResponse) => void,
		private onError?: (err: Event) => void,
		private onClose?: () => void
	) {}

	connect(): void {
		const ns = get(activeNamespaceId);
		if (!ns) throw new Error('No active namespace set');

		const wsUrl = new URL(getWSBaseURL());
		wsUrl.pathname = `/api/v1/namespaces/${ns}/accounts/${this.accountId}/streams/consume`;

		this.socket = new WebSocket(
			wsUrl.toString(), [STREAM_SUBPROTOCOL]
		);

		this.socket.onopen = () => {
			const startMsg: StartStreamConsumerRequest = {
				account_id: this.accountId,
				stream: this.streamName
			};
			this.socket?.send(JSON.stringify(startMsg));
		};

		this.socket.onmessage = (event: MessageEvent) => {
			try {
				const parsed: ResponseData<ConsumerMessageResponse> = JSON.parse(event.data);
				this.onMessage(parsed.data);
			} catch (e) {
				console.error('Failed to parse message', e);
			}
		};

		this.socket.onerror = (err: Event) => {
			this.onError?.(err);
		};

		this.socket.onclose = () => {
			this.onClose?.();
			this.socket = null;
		};
	}

	disconnect(): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close();
		}
	}
}
