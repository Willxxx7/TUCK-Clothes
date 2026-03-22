import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  retries: 0,
  use: {
    // No baseURL, use full URL in test
    trace: 'on',
  },
});
