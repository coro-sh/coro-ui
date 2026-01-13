import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignores
  {
    ignores: ['build/', '.svelte-kit/', 'dist/', '**/*.svelte.ts'],
  },

  // Base configs
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],

  // Globals
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Svelte: parse <script> with TS
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },

  // Overrides
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    },
  },

  // Disable formatting rules that conflict with Prettier
  ...svelte.configs['flat/prettier'],
];
