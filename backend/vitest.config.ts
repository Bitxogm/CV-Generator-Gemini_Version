import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'], // ← AGREGAR ESTO
    coverage: {
      provider: 'v8', // ← Tu versión (v8 o c8, ambos funcionan)
      reporter: ['text', 'json', 'html'],
      exclude: [  // ← AGREGAR ESTO
        'node_modules/',
        'src/__tests__/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@application': path.resolve(__dirname, './src/application'),
    },
  },
});