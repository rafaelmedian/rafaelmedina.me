import { expect, test } from "@playwright/test"
import { maxNoteLikesPerVisitor } from "../../src/data/likeLimits"
import { likesApiUrl } from "./likesApi"

async function openNote(page: import("@playwright/test").Page, title = "Designing Matcha") {
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  await page.getByRole("button", { name: title, exact: true }).click()
}

test("spam clicks all count, batch into one write, and survive a reload", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  const status = page.getByRole("status", { name: "Note likes" })
  const initial = Number((await status.textContent())!.split(" ")[0])
  const write = page.waitForRequest((request) => request.url().includes("/likes") && request.method() === "PUT")
  const saved = page.waitForResponse((response) => response.url().includes("/likes") && response.request().method() === "PUT")
  await like.click({ clickCount: 3 })
  await expect(status).toHaveText(`${initial + 3} likes`)
  expect((await write).postDataJSON()).toEqual({ increment: 3 })
  expect((await saved).ok()).toBe(true)
  await page.reload()
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText(`${initial + 3} likes`)
  await expect(page.getByRole("button", { name: "Like this note", exact: true })).toHaveAttribute("data-liked", "true")
})

test("failed saves roll the count back and idle reading does not poll", async ({ page }) => {
  let reads = 0
  await page.route("**/notes/*/likes", async (route) => {
    if (route.request().method() === "PUT") {
      await route.fulfill({ status: 503, json: { error: "Unavailable" } })
    } else {
      reads++
      await route.fulfill({ json: { count: 7, visitorLikes: 0 } })
    }
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  await like.click({ clickCount: 2 })
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText("9 likes")
  await expect(page.getByRole("alert")).toHaveText("Couldn't save your likes. Please try again.")
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText("7 likes")
  await expect(like).not.toHaveAttribute("data-liked")
  await page.clock.install()
  const before = reads
  await page.clock.fastForward(60000)
  expect(reads).toBe(before)
})

test("the like limit blocks new writes without disturbing the count", async ({ page }) => {
  let writes = 0
  await page.route("**/notes/*/likes", async (route) => {
    if (route.request().method() === "PUT") writes++
    await route.fulfill({ json: { count: 30, visitorLikes: maxNoteLikesPerVisitor } })
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note (limit reached)" })
  await expect(like).toBeEnabled()
  await like.click()
  // The debounce window is 500ms; waiting past it proves no write was queued.
  await page.waitForTimeout(800)
  expect(writes).toBe(0)
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText("30 likes")
  await expect(like).toHaveAttribute("data-liked", "true")
})

test("taps survive reloading before the debounce flush", async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page, "Room to figure it out")
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  const visitor = await page.evaluate(() => localStorage.getItem("rafaelmedina:likes-visitor")!)
  const headers = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": visitor }
  const endpoint = `${likesApiUrl}/notes/room-to-figure-it-out/likes`
  // Freeze timers so the click cannot accidentally drain before navigation.
  await page.clock.install()
  await page.clock.pauseAt(new Date())
  await like.click({ clickCount: 3 })
  await page.reload()
  await expect.poll(async () => (await (await request.get(endpoint, { headers })).json()).visitorLikes).toBe(3)
  await page.reload()
  await expect(page.getByRole("button", { name: "Like this note", exact: true })).toHaveAttribute("data-liked", "true")
})

test("leaving drains taps behind an in-flight save and reconciles out-of-order responses", async ({ page }) => {
  let count = 7
  let visitorLikes = 0
  let releaseFirst!: () => void
  const firstResponse = new Promise<void>((resolve) => { releaseFirst = resolve })
  let writes = 0
  await page.route("**/notes/*/likes", async (route) => {
    if (route.request().method() !== "PUT") {
      await route.fulfill({ json: { count, visitorLikes } })
      return
    }
    writes++
    const increment = route.request().postDataJSON().increment
    count += increment
    visitorLikes += increment
    const saved = { count, visitorLikes }
    if (writes === 1) await firstResponse
    await route.fulfill({ json: saved })
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  await like.click()
  await expect.poll(() => writes).toBe(1)
  await like.click({ clickCount: 2 })
  // A page can enter the back/forward cache and later resume this component.
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })))
  await expect.poll(() => writes).toBe(2)
  releaseFirst()
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText("10 likes")
  await page.waitForTimeout(700)
  expect(writes).toBe(2)
  expect(visitorLikes).toBe(3)
})
