import { expect, test } from "@playwright/test"

/* The notes reader covers the batching machinery itself; these cover what is
   the gallery's own: the pill rides the line the artwork ends on, and paging
   swaps the count for the project actually on screen. */

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

const likeButton = { name: "Like this project", exact: true } as const

test("a project preview counts its own likes and keeps them across a reopen", async ({ page }) => {
  await page.goto("/work/matcha-token-page/")
  const like = page.getByRole("button", likeButton)
  await expect(like).toBeEnabled()
  const status = page.getByRole("status", { name: "Project likes" })
  const initial = Number((await status.textContent())!.split(" ")[0])

  const write = page.waitForRequest((request) =>
    request.url().includes("/projects/preview-shot-21/likes") && request.method() === "PUT")
  const saved = page.waitForResponse((response) =>
    response.url().includes("/projects/preview-shot-21/likes") && response.request().method() === "PUT")
  await like.click({ clickCount: 2 })
  await expect(status).toHaveText(`${initial + 2} likes`)
  expect((await write).postDataJSON()).toEqual({ increment: 2 })
  expect((await saved).ok()).toBe(true)

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await page.goto("/work/matcha-token-page/")
  await expect(page.getByRole("status", { name: "Project likes" })).toHaveText(`${initial + 2} likes`)
  await expect(page.getByRole("button", likeButton)).toHaveAttribute("data-liked", "true")
})

test("paging to the next project reads that project's own count", async ({ page }) => {
  // Two neighbours with counts that cannot be confused for one another.
  const counts: Record<string, number> = { "preview-shot-9": 8, "preview-shot-16": 41 }
  await page.route("**/projects/*/likes", async (route) => {
    const project = new URL(route.request().url()).pathname.split("/")[2]
    await route.fulfill({ json: { count: counts[project] ?? 0, visitorLikes: 0 } })
  })
  await page.goto("/work/matcha-multiwallet-flow/")
  await expect(page.getByRole("status", { name: "Project likes" })).toHaveText("8 likes")

  await page.getByRole("button", { name: "Next preview", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha homepage")
  // The pill is keyed by project, so the previous count never lingers under the
  // new title while that project's own read is still in flight.
  await expect(page.getByRole("status", { name: "Project likes" })).toHaveText("41 likes")
})

test("the pill sits on the line where the artwork meets the prose", async ({ page }) => {
  await page.goto("/work/matcha-homepage/")
  const like = page.getByRole("button", likeButton)
  await expect(like).toBeEnabled()

  const pill = (await like.boundingBox())!
  const artwork = (await page.locator(".preview-gallery-media-frame").boundingBox())!
  const seam = artwork.y + artwork.height
  // Centred on the seam: half over the shot, half over the white below it.
  expect(Math.abs(pill.y + pill.height / 2 - seam)).toBeLessThan(2)
  // And it takes no room out of the flow, so the prose starts where it did.
  const title = (await page.locator(".preview-gallery-title").boundingBox())!
  expect(title.y).toBeGreaterThan(seam)
})

test("the résumé slide carries no like pill", async ({ page }) => {
  await page.goto("/resume/")
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("button", likeButton)).toBeHidden()
})
