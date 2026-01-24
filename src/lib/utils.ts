import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function shortenStr(str?: string, maxLen: number = 30): string {
	if (!str) {
		return '';
	}
	return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str;
}

export function formatEpoch(epoch: number): string {
	return new Intl.DateTimeFormat(navigator.language, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	}).format(new Date(epoch * 1000));
}

export function formatTimeSince(timestamp: number): string {
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const now = Date.now();
	const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000); // Convert to milliseconds

	const intervals: { [key: string]: number } = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
		second: 1,
	};

	for (const [unit, seconds] of Object.entries(intervals)) {
		const value = Math.floor(diffInSeconds / seconds);
		if (value >= 1 || unit === 'second') {
			return rtf.format(-value, unit as Intl.RelativeTimeFormatUnit);
		}
	}

	return 'just now'; // Fallback for very recent times
}

export function formatDuration(seconds?: number): string {
	if (!seconds) {
		return 'Unlimited';
	}

	if (seconds === 0) return '0 seconds';

	const timeUnits = [
		{ label: 'day', value: Math.floor(seconds / 86400) },
		{ label: 'hour', value: Math.floor((seconds % 86400) / 3600) },
		{ label: 'minute', value: Math.floor((seconds % 3600) / 60) },
		{ label: 'second', value: seconds % 60 },
	];

	return timeUnits
		.filter((unit) => unit.value > 0) // Remove empty units
		.map((unit) => `${unit.value} ${unit.label}${unit.value > 1 ? 's' : ''}`) // Add plural "s" if needed
		.join(', ');
}

export function upperCaseFirstChar(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';

	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = bytes / Math.pow(1024, i);

	return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}
