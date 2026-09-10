import { expect, test } from "@playwright/test"

test("keeps reader chunks off the initial load and opens them on demand", async ({ page }) => {
  const scripts: string[] = []
  page.on("request", request => { if (request.resourceType() === "script") scripts.push(request.url()) })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  // WritingArticle carries 34KB of prose that only a note's own reader or its
  // own page needs, so it is checked alongside the readers that pull it in.
  expect(scripts.some(url => /WritingsReader|WritingArticle|PersonalPhotosSheet/.test(url))).toBe(false)
  await page.getByRole("button", { name: "Open writings folder" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  expect(scripts.some(url => url.includes("WritingsReader"))).toBe(true)
  expect(scripts.some(url => url.includes("WritingArticle"))).toBe(true)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await page.getByRole("button", { name: "Personal life" }).click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  expect(scripts.some(url => url.includes("PersonalPhotosSheet"))).toBe(true)
})

test("opens a directly linked note without requiring the folder first", async ({ page }) => {
  await page.goto("/?writing=designing-matcha")
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).not.toHaveURL(/writing=/)
})

for (const { chunk, triggerName, dialogName, retryLabel } of [
  { chunk: "WritingsReader", triggerName: "Open writings folder", dialogName: "Notes", retryLabel: "Try opening notes again" },
  { chunk: "PersonalPhotosSheet", triggerName: "Personal life", dialogName: "Personal photos", retryLabel: "Try opening photos again" },
]) {
  test(`${chunk} can be cancelled while its download is pending`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
    await page.goto("/")
    const trigger = page.getByRole("button", { name: triggerName, exact: true })
    await trigger.click()
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    await page.keyboard.press("Escape")
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.getByRole("dialog")).toHaveCount(0)
    // A later activation uses the loaded module and still opens normally.
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
  })

  for (const destination of ["project", "other reader"]) {
    test(`${chunk} ignores a pending open after selecting ${destination}`, async ({ page }) => {
      let release!: () => void
      const held = new Promise<void>(resolve => { release = resolve })
      await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
      await page.goto("/")
      await page.getByRole("button", { name: triggerName, exact: true }).click()
      await expect(page.locator('[aria-busy="true"]')).toBeVisible()
      if (destination === "project") {
        await page.locator(".mosaic-row-card").first().click()
        await expect(page.locator(".preview-gallery-popup")).toBeVisible()
      } else {
        await page.getByRole("button", { name: chunk === "WritingsReader" ? "Personal life" : "Open writings folder", exact: true }).click()
        await expect(page.getByRole("dialog", { name: chunk === "WritingsReader" ? "Personal photos" : "Notes", exact: true })).toBeVisible()
      }
      release()
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
      await expect(page.getByRole("dialog", { name: dialogName, exact: true, includeHidden: true })).toHaveCount(0)
      await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
      await page.keyboard.press("Escape")
      await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0)
      await page.getByRole("button", { name: triggerName, exact: true }).click()
      await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
    })
  }

  test(`${chunk} retries a failed download without losing the page`, async ({ page }) => {
    let fail = true
    await page.route(`**/${chunk}-*.js*`, route => fail ? route.abort("failed") : route.continue())
    await page.goto("/")
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByText(retryLabel, { exact: true })).toBeVisible()
    await expect(page.getByRole("dialog")).toHaveCount(0)
    fail = false
    // Photo button's accessible name includes its loading/error label.
    await page.getByRole("button", { name: chunk === "PersonalPhotosSheet" ? retryLabel : triggerName, exact: true }).click()
    await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
  })
}

/* A chunk a reader needs but does not own. Retrying cannot recover it -- the
   module registry keeps the rejection -- so the reader offers a reload instead.

   The name is whatever Rollup emits for the imports two lazy readers have in
   common, not something this repo authors: the notes entry here was `sounds`
   until the like pill became the second module the notes reader and the preview
   gallery both pull in, and the shared chunk took the pill's name. So the route
   counts what it stopped, and the test fails on a pattern that has gone stale
   rather than quietly blocking nothing and reporting a missing error message. */
for (const { dependency, triggerName, retryLabel, reloadLabel, dialogName } of [
  { dependency: "LikeButton", triggerName: "Open writings folder", retryLabel: "Try opening notes again", reloadLabel: "Reload to try notes again", dialogName: "Notes" },
  { dependency: "DialogTitle", triggerName: "Personal life", retryLabel: "Try opening photos again", reloadLabel: "Reload to try photos again", dialogName: "Personal photos" },
]) {
  test(`offers a reload when a cached ${dependency} dependency cannot be retried`, async ({ page }) => {
    let fail = true
    let blocked = 0
    await page.route(`**/${dependency}-*.js*`, route => {
      if (!fail) return route.continue()
      blocked++
      return route.abort("failed")
    })
    await page.goto("/")
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByText(retryLabel, { exact: true })).toBeVisible()
    expect(blocked).toBeGreaterThan(0)
    fail = false
    const retryName = triggerName === "Personal life" ? retryLabel : triggerName
    await page.getByRole("button", { name: retryName, exact: true }).click()
    await expect(page.getByText(reloadLabel, { exact: true })).toBeVisible()
    const reloadName = triggerName === "Personal life" ? reloadLabel : triggerName
    await Promise.all([
      page.waitForEvent("load"),
      page.getByRole("button", { name: reloadName, exact: true }).click(),
    ])
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
  })
}

for (const destination of ["project", "photos"]) {
  test(`a pending directly linked note yields to ${destination}`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route("**/WritingsReader-*.js*", async route => { await held; await route.continue() })
    await page.goto("/?writing=designing-matcha")
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    if (destination === "project") {
      await page.locator(".mosaic-row-card").first().click()
      await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    } else {
      await page.getByRole("button", { name: "Personal life", exact: true }).click()
      await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
    }
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
    await expect(page.locator(".writings-dialog")).toHaveCount(0)
    await expect(page).not.toHaveURL(/writing=/)
  })
}

for (const { chunk, triggerName } of [
  { chunk: "WritingsReader", triggerName: "Open writings folder" },
  { chunk: "PersonalPhotosSheet", triggerName: "Personal life" },
]) {
  test(`${chunk} yields to a project opened through browser Forward`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
    await page.goto("/")
    await page.locator(".mosaic-row-card").first().click()
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    await page.goBack()
    await expect(page.locator(".preview-gallery-popup")).toBeHidden()
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    await page.goForward()
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
  })
}

test("retrying a directly linked note preserves the selected article", async ({ page }) => {
  let fail = true
  await page.route("**/WritingsReader-*.js*", route => fail ? route.abort("failed") : route.continue())
  await page.goto("/?writing=designing-matcha")
  await expect(page.getByText("Try opening notes again", { exact: true })).toBeVisible()
  fail = false
  await page.getByRole("button", { name: "Open writings folder", exact: true }).click()
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(page).toHaveURL(/writing=designing-matcha/)
})
