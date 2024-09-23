import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@src': '/src',
      '@controllers': '/src/controllers',
      '@services': '/src/services',
      '@models': '/src/models'
    },
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html']
    }
  }
});
  