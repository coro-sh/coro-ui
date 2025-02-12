export function newError(name: string, message?: string): Error {
	const err = new Error(message);
	err.name = name;
	return err;
}

export function newDetailsError(name: string, details: string[]): Error {
	const err = new Error(details.join(';'));
	err.name = name;
	return err;
}

export function newResponseError(status: number, statusText: string): Error {
	const err = new Error(`${status} ${statusText}`);
	err.name = 'Error Response';
	return err;
}

export function newUnsupportedResponseError(): Error {
	return newError('Bad Response', `Unsupported response schema`);
}

export function newUnsupportedResponseContentTypeError(contentType: string): Error {
	return newError('Bad Response', `Unsupported Content-Type: ${contentType}`);
}

export function newUnexpectedNoContentResponse(status: number): Error {
	return newError('Bad Response', `Expected no content 204 status but received: ${status}`);
}


export function newNetworkError(error: unknown): Error {
	const parsed = toError(error);
	parsed.name = 'Network Error';
	return parsed;
}

export function newUnexpectedError(message?: string): Error {
	const err = new Error(message);
	err.name = 'Unexpected';
	return err;
}

export function newUnknownError(): Error {
	const err = new Error('An unknown error occurred');
	err.name = 'Unknown';
	return err;
}

export function toError(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	} else if (typeof error === 'string') {
		return newUnexpectedError(error);
	} else {
		return newUnknownError();
	}
}
