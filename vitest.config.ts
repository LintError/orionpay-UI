import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Vitest config for the app's TypeScript tests.
//
// The previous script ("node --test src/**/*.test.ts") could not run: Node
// 20 has no TypeScript loader, the glob relied on shell expansion, and the
// test imports used extensions/aliases Node's resolver rejects. Vitest runs
// the .ts files directly and resolves imports the same way Next/the app does.
export default defineConfig({
  resolve: {
    // Mirrors the "@/*" -> "./*" alias declared in tsconfig.json so tests can
    // import modules exactly as the app does (e.g. "@/src/utils/stellar").
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
