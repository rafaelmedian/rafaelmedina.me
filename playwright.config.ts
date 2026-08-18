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
  webServer: {
    command: "npm run test:e2e:serve",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    env: {
      VITE_APPLE_MAPS_SNAPSHOT_URL: "https://example.test/apple-maps-punta-cana.png",
    },
  },
})
