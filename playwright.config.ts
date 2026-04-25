import { defineConfig, devices } from '@playwright/test';

const BACKEND_PORT = 9999;
const FRONTEND_PORT = 9527;
const BASE_URL = `http://127.0.0.1:${FRONTEND_PORT}`;

const E2E_DB = 'sqlite://app_system_e2e.sqlite3?busy_timeout=5000';
const REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379/15';

const backendEnv = {
  DB_URL: E2E_DB,
  REDIS_URL,
  APP_DEBUG: 'false',
  WORKERS: '1',
  GUARD_ENABLED: 'false'
};

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `uv run python -m granian --interface asgi --host 127.0.0.1 --port ${BACKEND_PORT} --workers 1 app:app`,
      cwd: '..',
      url: `http://127.0.0.1:${BACKEND_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: backendEnv
    },
    {
      command: 'pnpm dev',
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  ]
});
