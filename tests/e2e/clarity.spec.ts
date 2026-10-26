import { expect, test } from "@playwright/test"
import type { AddressInfo } from "node:net"
import { createServer } from "vite"

for (const projectId of ["", "test-project"]) {
  test(`Clarity ${projectId ? "starts once without Google Analytics" : "stays off without a project ID"}`, async ({ page }) => {
    const server = await createServer({
      appType: "spa",
      logLevel: "silent",
      define: {
        "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify(projectId),
        "import.meta.env.VITE_GA_MEASUREMENT_ID": JSON.stringify(""),
      },
      server: { host: "127.0.0.1", port: 0 },
    })
    await server.listen()
    const { port } = server.httpServer!.address() as AddressInfo
    const requests: string[] = []
    await page.route("https://www.clarity.ms/**", route => {
      requests.push(route.request().url())
      return route.fulfill({ contentType: "application/javascript", body: "" })
    })

    try {
      await page.goto(`http://127.0.0.1:${port}`)
      const scripts = page.locator('script[src^="https://www.clarity.ms/tag/"]')
      if (projectId) {
        await expect(scripts).toHaveCount(1)
        await expect.poll(() => requests).toEqual([`https://www.clarity.ms/tag/${projectId}`])
        await page.evaluate(async () => {
          const modulePath = "/src/lib/clarity.ts"
          const { startClarity } = await import(/* @vite-ignore */ modulePath)
          startClarity()
        })
        await expect(scripts).toHaveCount(1)
      } else {
        await expect(scripts).toHaveCount(0)
        expect(requests).toEqual([])
      }
    } finally {
      await server.close()
    }
  })
}
