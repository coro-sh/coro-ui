export interface CloudLimits {
	namespaces: number;
	operators: number;
	accounts: number;
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
