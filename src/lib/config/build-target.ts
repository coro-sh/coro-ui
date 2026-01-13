export type BuildTarget = 'local' | 'cloud';

function normalize(v: string | undefined): BuildTarget {
	const s = (v ?? 'local').toLowerCase();
	if (s === 'cloud' || s === 'local') return s;
	return 'local';
}

export const BUILD_TARGET: BuildTarget = normalize(import.meta.env.VITE_BUILD_TARGET);
export const IS_CLOUD = BUILD_TARGET === 'cloud';
export const IS_LOCAL = BUILD_TARGET === 'local';
