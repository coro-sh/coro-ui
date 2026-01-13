import { toast } from 'svelte-sonner';

/**
 * Show an error toast with support for multi-line messages (split by semicolon)
 */
export function showError(error: Error | string) {
	const name = error instanceof Error ? error.name : 'Error';
	const message = error instanceof Error ? error.message : error;
	const messages = message.split(';').map((m) => m.trim());

	toast.error(name, {
		description: messages.join('\n'),
		duration: 4000,
	});
}

/**
 * Show a success toast for clipboard copy
 */
export function showCopied() {
	toast.success('Copied to clipboard');
}

/**
 * Show a generic success toast
 */
export function showSuccess(message: string, description?: string) {
	toast.success(message, { description });
}

/**
 * Show a generic info toast
 */
export function showInfo(message: string, description?: string) {
	toast.info(message, { description });
}

// Re-export toast for advanced usage
export { toast };
