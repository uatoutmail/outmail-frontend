import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // This codebase writes JSX in plain .js files (Next's SWC toolchain
  // allows it). Vite's own esbuild-based transform (which runs before
  // @vitejs/plugin-react's babel step even sees the file) only parses
  // .jsx/.tsx as JSX by default, so .js files with JSX fail to parse
  // without this — widening plugin-react's `include` alone isn't enough.
  esbuild: {
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: [],
  },
  plugins: [react({ include: /\.(jsx?|tsx?)$/ })],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  test: {
    // Without the e2e/ addition, Vitest's default file glob also picks up
    // e2e/*.spec.js (Playwright specs) and fails trying to parse
    // test.describe() outside a Playwright config — the two runners' spec
    // files need to stay mutually exclusive. Spreads Vitest's own defaults
    // (configDefaults.exclude) rather than replacing them outright.
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    environment: 'jsdom',
    // jsdom only provides localStorage/sessionStorage for a non-opaque
    // origin — without an explicit url it defaults to "about:blank" and
    // window.localStorage is silently undefined. AuthContext relies on
    // localStorage directly, so this isn't optional.
    environmentOptions: {
      jsdom: { url: 'http://localhost:3000' },
    },
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    // Node's --localstorage-file (see the test script below) backs
    // localStorage with ONE file for the whole process. Parallel test
    // files racing on that file corrupt each other's state — see
    // out-192-frontend-test-progress memory for the full story (found
    // first in outmail-admin).
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
