import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: { provider: 'v8', reporter: ['text', 'html'], include: ['src/**/*.ts', 'src/**/*.tsx'], exclude: ['src/**/*.test.*', 'src/main.tsx'] },
  },
});
