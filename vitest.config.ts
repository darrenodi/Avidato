import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    // AI generation calls can take 30-90 seconds — give generous room
    testTimeout: 120_000,
    hookTimeout: 180_000,
    reporters: ['verbose'],
    // Load .env.local before any module is evaluated (needed for GOOGLE_API_KEY etc.)
    env: {},
    setupFiles: ['./src/lib/__tests__/lessons/setup.ts'],
    include: ['src/**/__tests__/**/*.test.ts'],
  },
})
