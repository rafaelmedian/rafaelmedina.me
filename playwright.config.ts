import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run likes:migrate:local && npm run likes:dev",
      url: "http://127.0.0.1:8787/health",
      reuseExistingServer: false,
    },
    {
      // Serves an existing dist/ — the build runs once ahead of Playwright
      // (npm run test:e2e locally, a build step in CI) rather than again here.
      // VITE_LIKES_API_URL belongs on that build: Vite inlines it, so setting
      // it on this static file server would do nothing.
      command: "npm run test:e2e:serve",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
    },
  ],
})
