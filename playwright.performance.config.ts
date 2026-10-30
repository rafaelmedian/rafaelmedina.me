import { defineConfig } from "@playwright/test"

const port = Number(process.env.PERFORMANCE_PORT ?? 4186)
export default defineConfig({
  testDir: "./tests/performance",
  outputDir: "test-results-performance",
  workers: 1,
  forbidOnly: true,
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"], ["json", { outputFile: "test-results-performance/results.json" }]],
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
})
