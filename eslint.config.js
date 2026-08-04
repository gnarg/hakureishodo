import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		// Vendored third-party assets (served verbatim, not authored in this repo) are excluded
		// from linting. newrelic.js is the New Relic browser agent; main.min.js is the bundled
		// Minimal Mistakes theme JS (both under static/js/).
		ignores: ['build/', '.svelte-kit/', 'dist/', 'static/js/main.min.js', 'static/js/newrelic.js']
	}
];
