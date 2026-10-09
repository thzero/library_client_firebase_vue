import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		// the first import transforms the whole dependency tree, cold
		testTimeout: 30000,
		include: [ 'test/**/*.test.js' ],
		setupFiles: [ 'test/setup.js' ],
		coverage: {
			provider: 'v8',
			reporter: [ 'text-summary', 'lcov' ],
			// every source file, so a file no test loads counts as uncovered
			include: [ '**/*.{js,vue}' ],
			exclude: [ 'test/**', 'coverage/**', '_config/**', '*.config.*', 'openSource.js' ],
			// a ratchet, about 2 points under what was measured on 2026-10-09
			// (statements 44.06, branches 46.87, functions 36.36, lines 43.63);
			// raise these as tests are added, never lower them
			thresholds: { statements: 42, branches: 44, functions: 34, lines: 41 }
		},
		server: {
			deps: {
				// @thzero packages import without file extensions, which Vite resolves
				// but Node does not, so they must be transformed rather than externalized
				inline: [ /@thzero\// ]
			}
		}
	}
});
