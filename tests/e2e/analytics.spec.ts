import { expect, test } from "@playwright/test"
import type { AddressInfo } from "node:net"
import { createServer, type ViteDevServer } from "vite"

let analyticsServer: ViteDevServer
let analyticsBaseUrl: string
const previousAnalyticsId = process.env.VITE_GA_MEASUREMENT_ID

test.beforeAll(async () => {
  process.env.VITE_GA_MEASUREMENT_ID = "G-TEST"
  analyticsServer = await createServer({
    appType: "spa",
    logLevel: "silent",
    root: process.cwd(),
    server: { host: "127.0.0.1", port: 0 },
  })
  await analyticsServer.listen()
  const address = analyticsServer.httpServer?.address() as AddressInfo
  analyticsBaseUrl = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  await analyticsServer.close()
  if (previousAnalyticsId === undefined) delete process.env.VITE_GA_MEASUREMENT_ID
  else process.env.VITE_GA_MEASUREMENT_ID = previousAnalyticsId
})

test("attributes the floating table-of-contents About action to the TOC", async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  )
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(analyticsBaseUrl)
  await page.evaluate(() => window.scrollTo(0, 160))

  await page.getByRole("button", { name: /^Table of contents:/ }).click()
  await page.getByRole("navigation", { name: "Table of contents" }).getByRole("link", { name: "About" }).click()

  const aboutScrollEvent = await page.evaluate(() =>
    window.dataLayer
      ?.map((entry) => Array.from(entry as ArrayLike<unknown>))
      .find(([command, eventName]) => command === "event" && eventName === "about_scroll"),
  )
  expect(aboutScrollEvent).toEqual(["event", "about_scroll", { about_scroll_trigger: "toc_about" }])
})

test("records the visitor reaction that lands on a chat message", async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  )
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(analyticsBaseUrl)
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))

  const chat = page.getByRole("region", { name: "Chat with Rafa" })
  await chat.getByRole("button", { name: "React to “Hey, I’m Rafa.”" }).click()
  await page.getByRole("menu", { name: "React to “Hey, I’m Rafa.”" })
    .getByRole("menuitemradio", { name: "Love" }).click()

  const reactionEvent = await page.evaluate(() =>
    window.dataLayer
      ?.map((entry) => Array.from(entry as ArrayLike<unknown>))
      .find(([command, eventName]) => command === "event" && eventName === "about_intro_reaction"),
  )
  expect(reactionEvent).toEqual(["event", "about_intro_reaction", { message_index: 0, reaction: "love" }])
})
