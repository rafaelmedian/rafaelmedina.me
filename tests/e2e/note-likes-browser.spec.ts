import { expect, test } from "@playwright/test"

async function openNote(page: import("@playwright/test").Page) {
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  await page.getByRole("button", { name: "Designing Matcha", exact: true }).click()
}

test("reader saves likes across reloads and can unlike", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  await like.click()
  await expect(page.getByRole("button", { name: "Unlike this note" })).toHaveAttribute("aria-pressed", "true")
  await page.reload()
  const unlike = page.getByRole("button", { name: "Unlike this note" })
  await expect(unlike).toBeEnabled()
  await unlike.click()
  await expect(like).toHaveAttribute("aria-pressed", "false")
})

test("failed saves preserve the count and idle reading does not poll", async ({ page }) => {
  let reads = 0
  await page.route("**/notes/*/likes", async (route) => {
    if (route.request().method() === "PUT") {
      await route.fulfill({ status: 503, json: { error: "Unavailable" } })
    } else {
      reads++
      await route.fulfill({ json: { count: 7, liked: false } })
    }
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openNote(page)
  const like = page.getByRole("button", { name: "Like this note", exact: true })
  await expect(like).toBeEnabled()
  await like.click()
  await expect(page.getByRole("alert")).toHaveText("Couldn't save your like. Please try again.")
  await expect(page.getByRole("status", { name: "Note likes" })).toHaveText("7 likes")
  await expect(like).toHaveAttribute("aria-pressed", "false")
  await page.clock.install()
  const before = reads
  await page.clock.fastForward(60000)
  expect(reads).toBe(before)
})
