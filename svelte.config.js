import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const buildPath = process.env.BUILD_PATH || 'dist';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter({
			pages: buildPath,
			assets: buildPath,
			fallback: '200.html',
		}),
	},
};

export default config;
