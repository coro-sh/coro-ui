import type { LanguageType } from 'svelte-highlight/languages';

export type CodeBlockLanguage =
	LanguageType<'go'>
	| LanguageType<'python'>
	| LanguageType<'java'>
	| LanguageType<'javascript'>
	| LanguageType<'plaintext'>;
