import { defineConfig } from "@playwright/test"
import { likesApiUrl } from "./tests/e2e/likesApi"

// A second checkout runs its own suite on its own ports. The Worker's follows
// LIKES_API_URL, which the build reads too. E2E_PORT selects the preview
// server's port so an isolated run does not need to fork this file.
const likesPort = new URL(likesApiUrl).port
const previewPort = Number(process.env.E2E_PORT ?? 4174)
const previewUrl = `http://127.0.0.1:${previewPort}`

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: previewUrl,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: `npm run likes:migrate:local && npx wrangler dev --config workers/likes/wrangler.jsonc --port ${likesPort}`,
      url: `${likesApiUrl}/health`,
      reuseExistingServer: false,
    },
    {
      // Serves an existing dist/ — the build runs once ahead of Playwright
      // (npm run test:e2e locally, a build step in CI) rather than again here.
      // VITE_LIKES_API_URL belongs on that build: Vite inlines it, so setting
      // it on this static file server would do nothing.
      command: `npm run test:e2e:serve -- --port ${previewPort} --strictPort`,
      url: previewUrl,
      reuseExistingServer: false,
    },
  ],
})
