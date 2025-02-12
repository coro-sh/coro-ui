import flowbitePlugin from 'flowbite/plugin';
import colors from 'tailwindcss/colors';

import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#e6f8f6',
					'100': '#cdf0ed',
					'200': '#9be2db',
					'300': '#6ad3c8',
					'400': '#38c5b6',
					'500': '#06b6a4',
					'600': '#059283',
					'700': '#046d62',
					'800': '#024942',
					'900': '#012421'
				},
				red: {
					'750': '#af1414',
				},
				mono: colors.zinc,
				light: {
					base: colors.zinc[900],
					alt: colors.zinc[800],
					canvas: colors.zinc[50],
					content: colors.white,
					contentHover: '#fbfbfb',
					border: colors.zinc[300]
				},
				dark: {
					base: colors.zinc[50],
					alt: colors.zinc[300],
					canvas: '#19191c',
					content: '#26272d',
					contentHover: '#2b2c33',
					border: colors.zinc[700]
				}
			}
		}
	},

	plugins: [flowbitePlugin]
} as Config;
