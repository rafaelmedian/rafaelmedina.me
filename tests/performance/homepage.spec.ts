import { recordTransfers } from "./transferRecorder"
import { expect, test, type Page } from "@playwright/test"

async function measure(page: Page, slow = false) {
  const client = await page.context().newCDPSession(page)
  await client.send("Network.enable")
  await client.send("Network.setCacheDisabled", { cacheDisabled: true })
  if (slow) {
    await client.send("Network.emulateNetworkConditions", {
      offline: false, latency: 150, downloadThroughput: 200_000,
      uploadThroughput: 93_750, connectionType: "cellular4g",
    })
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 })
  }
  const transfers = recordTransfers(client)
  await page.addInitScript(() => {
    const metrics = { lcp: 0, lcpUrl: "", shifts: 0 }
    Object.assign(window, { loadMetrics: metrics })
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        metrics.lcp = entry.startTime
        metrics.lcpUrl = (entry as PerformanceEntry & { url?: string }).url ?? ""
      }
    }).observe({ type: "largest-contentful-paint", buffered: true })
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
        if (!entry.hadRecentInput) metrics.shifts += entry.value
      }
    }).observe({ type: "layout-shift", buffered: true })
  })
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/")
  const loadedAt = Date.now()
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.waitForTimeout(Math.max(0, 7000 - (Date.now() - loadedAt)))
  const metrics = await page.evaluate(() => (window as unknown as {
    loadMetrics: { lcp: number; lcpUrl: string; shifts: number }
  }).loadMetrics)
  const resources = transfers()
  expect(errors).toEqual([])
  return {
    ...metrics,
    bytes: resources.reduce((total, resource) => total + resource.bytes, 0),
    videoBytes: resources.filter(resource => resource.type === "Media").reduce((total, resource) => total + resource.bytes, 0),
    resources,
  }
}

for (const profile of [
  { name: "desktop", width: 1440, height: 1000, dpr: 1, total: 1_200_000, video: 300_000 },
  { name: "mobile", width: 390, height: 844, dpr: 2, total: 900_000, video: 200_000 },
]) {
  test(`${profile.name} cold homepage stays inside its transfer budget`, async ({ browser }, info) => {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: profile.dpr, isMobile: profile.name === "mobile", hasTouch: profile.name === "mobile", baseURL: info.project.use.baseURL })
    try {
      const result = await measure(await context.newPage())
      await info.attach("load-budget.json", { body: JSON.stringify(result, null, 2), contentType: "application/json" })
      expect(result.bytes).toBeLessThan(profile.total)
      expect(result.videoBytes).toBeGreaterThan(0)
      expect(result.videoBytes).toBeLessThan(profile.video)
      expect(result.shifts).toBeLessThan(0.1)
    } finally { await context.close() }
  })
}

test("throttled mobile paints its main content within 3.5 seconds", async ({ browser }, info) => {
  const runs = []
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true, baseURL: info.project.use.baseURL })
    try { runs.push(await measure(await context.newPage(), true)) }
    finally { await context.close() }
  }
  await info.attach("slow-mobile.json", { body: JSON.stringify(runs, null, 2), contentType: "application/json" })
  const median = runs.map(run => run.lcp).sort((a, b) => a - b)[1]
  expect(median).toBeGreaterThan(0)
  expect(median).toBeLessThan(3500)
  expect(Math.max(...runs.map(run => run.shifts))).toBeLessThan(0.1)
})
