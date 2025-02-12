import { writable } from 'svelte/store';
import { toError } from '$lib/error';

export const successToast = writable<string | null>(null);
export const errorToast = writable<Error | null>(null);

export function showSuccessToast(message: string) {
	successToast.set(message);

	setTimeout(() => {
		successToast.set(null);
	}, 4100);
}

export function showErrorToast(error: any) {
	errorToast.set(toError(error));

	setTimeout(() => {
		errorToast.set(null);
	}, 4100);
}
