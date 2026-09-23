import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`shares conversation between portrait and booking at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Calendar</title>' }))
    await page.goto('/?tune=off')
    await page.locator('.mosaic-avatar-button').click()
    const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
    await expect(dialog.getByRole('textbox', { name: 'Your email' })).toBeVisible()
    await expect(dialog.locator('iframe')).toHaveCount(0)
    await dialog.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
    await dialog.getByRole('button', { name: 'Continue with email' }).click()
    await dialog.getByRole('textbox', { name: 'Your message' }).fill('Let’s talk about a design project.')
    await dialog.getByRole('button', { name: 'Book a time', exact: true }).click()
    await expect(dialog.locator('iframe')).toHaveAttribute('src', /email=visitor%40example.com/)
    await expect(dialog.locator('iframe')).toHaveAttribute('src', /theme=light/)
    await dialog.getByRole('button', { name: 'Back to conversation' }).click()
    await expect(dialog.getByRole('textbox', { name: 'Your message' })).toHaveValue('Let’s talk about a design project.')
    await page.keyboard.press('Escape')
    await expect(page.locator('.mosaic-avatar-button')).toBeFocused()
    await page.locator('.mosaic-booking-pill').click()
    await expect(dialog.getByRole('textbox', { name: 'Your message' })).toHaveValue('Let’s talk about a design project.')
    const bounds = await dialog.boundingBox()
    expect(bounds!.x + bounds!.width / 2).toBeCloseTo(width / 2, 0)
    const identity = await dialog.locator('.booking-identity').boundingBox()
    expect(identity!.y).toBe(20)
    expect(bounds!.y).toBeGreaterThan(identity!.y + identity!.height)
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
  })
}

test('retains failed messages and retries without duplicating delivery', async ({ page }) => {
  const requests: { email: string; message: string; requestId: string }[] = []
  await page.route('**/contact', async route => {
    requests.push(route.request().postDataJSON())
    await route.fulfill({ status: requests.length === 1 ? 503 : 200, json: requests.length === 1 ? { error: 'Please retry.' } : { sent: true } })
  })
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await dialog.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await dialog.getByRole('button', { name: 'Continue with email' }).click()
  await dialog.getByRole('textbox', { name: 'Your message' }).fill('A new project')
  await dialog.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(dialog.getByRole('alert')).toContainText('Please retry.')
  await dialog.getByRole('button', { name: 'Retry message' }).click()
  await expect(dialog.getByText('Delivered', { exact: true })).toBeVisible()
  expect(requests).toHaveLength(2)
  expect(requests[0]).toEqual({ email: 'visitor@example.com', message: 'A new project', requestId: expect.any(String) })
  expect(requests[1]).toEqual(requests[0])
})

test('validates email and keeps controls reachable in a short mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  const email = dialog.getByRole('textbox', { name: 'Your email' })
  await email.fill('visitor@incomplete')
  await expect(dialog.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
  await email.fill('visitor@example.com')
  await email.press('Enter')
  await expect(dialog.getByRole('textbox', { name: 'Your message' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Email options for visitor@example.com' }).click()
  await page.getByRole('menuitem', { name: 'Unsend', exact: true }).click()
  await expect(email).toBeFocused()
  await expect(email).toHaveValue('visitor@example.com')
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)
  }
  await expect(page.locator('.booking-backdrop')).toBeVisible()
  await expect(page.locator('.booking-backdrop')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(dialog).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  const box = await dialog.getByRole('button', { name: 'Continue with email' }).boundingBox()
  expect(box!.y + box!.height).toBeLessThan(480)
  await page.mouse.click(4, 4)
  await expect(dialog).toBeHidden()
  await expect(page.locator('.mosaic-booking-pill')).toBeFocused()
})

test('grows the centered conversation then scrolls history while holding the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/contact', route => route.fulfill({ json: { sent: true } }))
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await expect(dialog.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  const initial = await dialog.boundingBox()
  await dialog.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await dialog.getByRole('button', { name: 'Continue with email' }).click()
  await expect.poll(async () => (await dialog.boundingBox())!.height).toBeGreaterThan(initial!.height)
  for (let index = 0; index < 4; index++) {
    await dialog.getByRole('textbox', { name: 'Your message' }).fill(`Project detail ${index}: I’m building a new product and would love to talk about the design, onboarding, and the experience for our customers.`)
    await dialog.getByRole('button', { name: 'Send message', exact: true }).click()
    await expect(dialog.getByText('Delivered', { exact: true })).toHaveCount(index + 1)
  }
  const history = dialog.getByRole('log')
  expect(await history.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true)
  const composer = await dialog.getByRole('textbox', { name: 'Your message' }).boundingBox()
  expect(composer!.y + composer!.height).toBeLessThan(900)
  await page.mouse.move(50, 300)
  await page.mouse.wheel(0, 300)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(dialog).toBeVisible()
})

test('replays staggered greetings on open and skips motion when requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?tune=off')
  const trigger = page.locator('.mosaic-booking-pill')
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  for (let opening = 0; opening < 2; opening++) {
    await trigger.click()
    await expect(dialog).toBeVisible()
    const entrances = await dialog.locator('.booking-history > .booking-bubble').evaluateAll(nodes =>
      nodes.map(node => {
        const animation = node.getAnimations()[0]
        animation.pause()
        animation.currentTime = 100
        const hidden = getComputedStyle(node).opacity
        const delay = animation.effect!.getTiming().delay
        animation.currentTime = 1000
        return { delay, hidden, visible: getComputedStyle(node).opacity }
      }))
    expect(entrances).toEqual([
      { delay: 200, hidden: '0', visible: '1' },
      { delay: 360, hidden: '0', visible: '1' },
      { delay: 520, hidden: '0', visible: '1' },
    ])
    await dialog.getByRole('button', { name: 'Close conversation' }).click()
    await expect(dialog).toBeHidden()
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await trigger.click()
  await expect(dialog.locator('.booking-bubble').first()).toHaveCSS('animation-name', 'none')
  await expect(dialog.locator('.booking-bubble').first()).toHaveCSS('opacity', '1')
})

for (const width of [390, 1542]) {
  test(`opens contact info and returns to the draft at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?tune=off')
    await page.locator('.mosaic-booking-pill').click()
    const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
    await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
    await chat.getByRole('button', { name: 'Continue with email' }).click()
    await chat.getByRole('textbox', { name: 'Your message' }).fill('Keep my draft')
    const name = chat.getByRole('button', { name: 'Rafael Medina contact info' })
    await name.click()
    const contact = page.getByRole('dialog', { name: 'Rafael Medina', exact: true })
    await expect(contact).toBeVisible()
    await expect(contact.getByRole('button', { name: 'Close contact info' })).toBeFocused()
    await expect(contact.getByRole('link', { name: /email hey@rafaelmedina.me/ })).toHaveAttribute('href', 'mailto:hey@rafaelmedina.me')
    await expect(contact.getByRole('link', { name: /linkedin/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/rafaelmedian')
    const bounds = await contact.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
    if (width >= 900) {
      const chatBounds = await chat.boundingBox()
      expect(chatBounds!.x + chatBounds!.width / 2).toBeCloseTo(width / 4, 0)
      expect(bounds!.width).toBeCloseTo(width / 2 - 24, 0)
      const identity = await chat.locator(".booking-identity").boundingBox()
      expect(identity!.y).toBe(20)
      expect(identity!.x + identity!.width / 2).toBeCloseTo(width / 4, 0)
    }
    for (let index = 0; index < 7; index++) {
      await page.keyboard.press('Tab')
      await expect.poll(() => contact.evaluate(node => node.contains(document.activeElement))).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(contact).toBeHidden()
    await expect(chat).toBeVisible()
    await expect(name).toBeFocused()
    await expect(chat.getByRole('textbox', { name: 'Your message' })).toHaveValue('Keep my draft')
    await name.click()
    await contact.getByRole('button', { name: 'Close contact info' }).click()
    await expect(name).toBeFocused()
  })
}

test('moves the homepage portrait into the header and aligns composer controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args: Parameters<Element['animate']>) {
      const animation = animate.apply(this, args)
      if (this.matches('.booking-identity img')) animation.pause()
      return animation
    }
  })
  await page.goto('/?tune=off')
  const portrait = page.locator('.mosaic-avatar-button')
  await portrait.click()
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  const image = dialog.locator('.booking-identity img')
  await expect(image).toBeVisible()
  const source = await portrait.boundingBox()
  const initial = await image.boundingBox()
  expect(initial!.x).toBeCloseTo(source!.x, 0)
  expect(initial!.y).toBeCloseTo(source!.y, 0)
  expect(initial!.width).toBeCloseTo(source!.width, 0)
  await image.evaluate(node => node.getAnimations().forEach(animation => animation.finish()))
  await expect(image).toHaveCSS('width', '64px')
  const destination = await image.boundingBox()
  expect(destination!.y).toBe(20)
  await dialog.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await dialog.getByRole('button', { name: 'Continue with email' }).click()
  await expect.poll(async () => {
    const composer = await dialog.locator('.booking-composer').boundingBox()
    const booking = await dialog.getByRole('button', { name: 'Book a time' }).boundingBox()
    return Math.abs(composer!.height - booking!.height)
  }).toBeLessThan(1)
})
