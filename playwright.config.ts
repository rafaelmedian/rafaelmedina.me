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
      command: "npm run test:e2e:serve",
      url: "http://127.0.0.1:4174",
      env: { VITE_LIKES_API_URL: "http://127.0.0.1:8787" },
      reuseExistingServer: false,
    },
  ],
})
