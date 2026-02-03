export interface CloudLimits {
	operators: number;
	accounts: number;
	users: number;
}

export interface CloudPlanResponse {
	name: string;
	limits: CloudLimits;
}

export interface CloudMeResponse {
	id: string;
	email: string;
	name: string;
	plan: CloudPlanResponse;
}

export interface CloudLimitsResponse extends CloudLimits {}
