export interface CreateAccountRequest {
	name: string;
	limits?: AccountLimits;
}

export interface UpdateAccountRequest {
	name: string;
	limits?: AccountLimits;
}

export interface CreateUserRequest {
	name: string;
	limits?: UserLimits;
}

export interface UpdateUserRequest {
	name: string;
	limits?: UserLimits;
}

export type Response<T> = ResponseData<T> | ResponseError;

export type ResponsePage<T> = ResponsePageData<T> | ResponseError;

export interface ResponseData<T> {
	data: T;
}

export interface ResponsePageData<T> {
	data: T[];
	next_page_cursor?: string;
}

export interface ResponseError {
	error: {
		message: string;
		details?: string[];
	};
}

export interface NamespaceResponse {
	id: string;
	name: string;
}

export interface OperatorResponse {
	id: string;
	jwt: string;
	name: string;
	public_key: string;
	status: OperatorStatus;
}

export interface AccountResponse {
	id: string;
	operator_id: string;
	jwt: string;
	name: string;
	public_key: string;
	limits: AccountLimits;
}

export interface UserResponse {
	id: string;
	operator_id: string;
	account_id: string;
	public_key: string;
	jwt: string;
	name: string;
	limits: UserLimits;
}

export interface UserIssuanceResponse {
	issue_time: number;
	expire_time?: number;
	active: boolean;
}

export interface OperatorStatus {
	connected: boolean;
	connect_time?: number;
}

export interface AccountLimits {
	subscriptions?: number;
	payload_size?: number;
	imports?: number;
	exports?: number;
	connections?: number;
	user_jwt_duration_secs?: number;
}

export interface UserLimits {
	subscriptions?: number;
	payload_size?: number;
	jwt_duration_secs?: number;
}

export interface OperatorProxyTokenResponse {
	token: string;
}

export interface Stream {
	name: string;
	subjects: string[];
	message_count: number;
	consumer_count: number;
	create_time: number;
}

export interface StreamMessage {
	stream_sequence: string;
	subject: string;
	size_bytes: number;
	preview: string;
	timestamp: number;
}

export interface StreamMessageContent {
	stream_sequence: string;
	timestamp: number;
	data: string;
}
