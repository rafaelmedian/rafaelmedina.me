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
    if (width >= 900) {
      await expect(dialog.getByRole('textbox', { name: 'Your message' })).toBeVisible()
      // The iframe mounts before the grid has placed the conversation beside it.
      await expect.poll(async () => {
        const conversation = await dialog.locator('.booking-conversation').boundingBox()
        const calendar = await dialog.locator('.booking-calendar-stage').boundingBox()
        return conversation!.x + conversation!.width - calendar!.x
      }).toBeLessThan(0)
      const calendar = await dialog.locator('.booking-calendar-stage').boundingBox()
      expect(calendar!.x).toBeGreaterThanOrEqual(width / 2)
      await dialog.getByRole('textbox', { name: 'Your message' }).fill('Let’s talk about a design project.')
    } else {
      await expect(dialog.getByRole('textbox', { name: 'Your message' })).toBeHidden()
    }
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
    const composerBounds = await dialog.locator('.booking-compose-area').boundingBox()
    expect(composerBounds!.y + composerBounds!.height).toBeCloseTo(880, 0)
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
      await expect.poll(async () => {
        const chatBounds = await chat.boundingBox()
        return chatBounds!.x + chatBounds!.width / 2
      }).toBeCloseTo(width / 4, 0)
      expect(bounds!.width).toBeCloseTo(width / 2 - 24, 0)
      await expect.poll(async () => {
        const identity = await chat.locator(".booking-identity").boundingBox()
        return identity!.x + identity!.width / 2
      }).toBeCloseTo(width / 4, 0)
      expect((await chat.locator(".booking-identity").boundingBox())!.y).toBe(20)
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
  await expect(image).toHaveCSS('width', '52px')
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

test('replays saved email and delivered messages in conversation order', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/contact', route => route.fulfill({ json: { sent: true } }))
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  for (const message of ['First project detail', 'One more detail']) {
    await chat.getByRole('textbox', { name: 'Your message' }).fill(message)
    await chat.getByRole('button', { name: 'Send message', exact: true }).click()
  }
  await expect(chat.getByText('Delivered', { exact: true })).toHaveCount(2)
  await chat.getByRole('button', { name: 'Close conversation' }).click()
  await expect(chat).toBeHidden()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.mosaic-booking-pill').click()
  await expect(chat).toBeVisible()
  const entries = chat.locator('.booking-history > *')
  expect(await entries.evaluateAll(nodes => nodes.map(node => getComputedStyle(node).animationDelay)))
    .toEqual(['0.2s', '0.36s', '0.52s', '0.68s', '0.84s', '1s', '1.16s'])
  const receipt = chat.locator('.booking-delivery').last()
  await receipt.evaluate(node => {
    const animation = node.getAnimations()[0]
    animation.pause()
    animation.currentTime = 100
  })
  await expect(receipt).toHaveCSS('opacity', '0')
  await receipt.evaluate(node => node.getAnimations()[0].finish())
  await expect(receipt).toHaveCSS('opacity', '1')
  await expect(receipt).toContainText('Delivered')
})

test('dictates into a draft, handles permission errors, and stops on close', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeSpeechRecognition {
      onresult: ((event: { results: { transcript: string }[][] }) => void) | null = null
      onerror: ((event: { error: string }) => void) | null = null
      onend: (() => void) | null = null
      start() { Object.assign(window, { activeSpeech: this }) }
      stop() { this.onend?.() }
      abort() { Object.assign(window, { speechAborted: true }) }
    }
    Object.assign(window, { SpeechRecognition: FakeSpeechRecognition })
  })
  await page.route('**/contact', () => { throw new Error('Dictation must not send messages') })
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  await chat.getByRole('button', { name: 'Dictate message' }).click()
  await expect(chat.getByRole('button', { name: 'Stop dictation' })).toBeVisible()
  await page.evaluate(() => {
    const speech = (window as unknown as { activeSpeech: { onresult: (event: unknown) => void } }).activeSpeech
    speech.onresult({ results: [[{ transcript: 'Let’s discuss my project' }]] })
  })
  const message = chat.getByRole('textbox', { name: 'Your message' })
  await expect(message).toHaveValue('Let’s discuss my project')
  await expect(message).toHaveAttribute('readonly', '')
  await chat.getByRole('button', { name: 'Stop dictation' }).click()
  await expect(message).not.toHaveAttribute('readonly')
  await expect(chat.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled()
  await message.fill('')
  await chat.getByRole('button', { name: 'Dictate message' }).click()
  await page.evaluate(() => {
    const speech = (window as unknown as { activeSpeech: { onerror: (event: unknown) => void; onend: () => void } }).activeSpeech
    speech.onerror({ error: 'not-allowed' })
    speech.onend()
  })
  await expect(chat.getByRole('status')).toContainText('Microphone access was denied')
  await chat.getByRole('button', { name: 'Dictate message' }).click()
  await chat.getByRole('button', { name: 'Close conversation' }).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { speechAborted: boolean }).speechAborted)).toBe(true)
})

test('offers a typing fallback when browser dictation is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { SpeechRecognition: undefined, webkitSpeechRecognition: undefined })
  })
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  await chat.getByRole('button', { name: 'Dictate message' }).click()
  await expect(chat.getByRole('status')).toContainText('isn’t supported in this browser')
  await chat.getByRole('textbox', { name: 'Your message' }).fill('Typing still works')
  await expect(chat.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled()
})

test('switches contact details to scheduling and provides a contact back control', async ({ page }) => {
  await page.setViewportSize({ width: 1542, height: 953 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Calendar</title>' }))
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  const name = chat.getByRole('button', { name: 'Rafael Medina contact info' })
  await name.click()
  const contact = page.getByRole('dialog', { name: 'Rafael Medina', exact: true })
  await expect(contact.getByRole('link', { name: 'View resume' })).toBeVisible()
  await page.locator('.booking-time-button').click()
  await expect(contact).toBeHidden()
  await expect(chat.locator('iframe')).toBeVisible()
  await expect(chat.getByRole('button', { name: 'Back to conversation' })).toBeFocused()
  await name.click()
  await expect(contact).toBeVisible()
  await expect(chat.locator('iframe')).toBeHidden()
  await contact.getByRole('button', { name: 'Back to conversation' }).click()
  await expect(contact).toBeHidden()
  await expect(name).toBeFocused()
})

test('disables dictation during desktop scheduling and restores it on Back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Calendar</title>' }))
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  const microphone = chat.getByRole('button', { name: 'Dictate message' })
  await expect(microphone).toBeEnabled()
  await chat.getByRole('button', { name: 'Book a time', exact: true }).click()
  await expect(microphone).toBeVisible()
  await expect(microphone).toBeDisabled()
  await chat.getByRole('button', { name: 'Back to conversation' }).click()
  await expect(microphone).toBeEnabled()
})

test('keeps the close control aligned across conversation, contact, and calendar', async ({ page }) => {
  await page.setViewportSize({ width: 1542, height: 897 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Calendar</title>' }))
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  const booking = page.getByRole('dialog', { name: 'Chat with Rafael Medina', exact: true })
  const initial = await booking.getByRole('button', { name: 'Close conversation' }).boundingBox()
  await booking.getByRole('button', { name: 'Rafael Medina contact info' }).click()
  const contactClose = page.getByRole('button', { name: 'Close contact info' })
  await expect(contactClose).toBeVisible()
  expect(await contactClose.boundingBox()).toEqual(initial)
  await contactClose.click()
  await booking.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await booking.getByRole('button', { name: 'Continue with email' }).click()
  const calendar = booking.getByRole('button', { name: 'Book a time', exact: true })
  const microphone = booking.getByRole('button', { name: 'Dictate message' })
  expect(await calendar.locator('svg').evaluate(node => getComputedStyle(node).color)).toBe(await microphone.evaluate(node => getComputedStyle(node).color))
  await calendar.click()
  await expect(booking.locator('iframe')).toBeVisible()
  expect(await booking.getByRole('button', { name: 'Close conversation' }).boundingBox()).toEqual(initial)
})

test('keeps one close control visible while contact info exits', async ({ page }) => {
  await page.setViewportSize({ width: 1542, height: 953 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?tune=off')
  await page.locator('.mosaic-booking-pill').click()
  await page.getByRole('button', { name: 'Rafael Medina contact info' }).click()
  const panel = page.locator('.booking-contact-panel')
  await expect(panel).toBeVisible()
  await panel.evaluate(node => node.getAnimations().forEach(animation => animation.finish()))
  await expect(page.locator('.booking-close')).toHaveCSS('visibility', 'hidden')
  await page.getByRole('button', { name: 'Close contact info' }).click()
  await expect(panel).toHaveCount(0)
  await expect(page.locator('.booking-close')).toBeVisible()
  await expect.poll(async () => {
    const image = await page.locator('.booking-identity img').boundingBox()
    return Math.abs(image!.x + image!.width / 2 - 771)
  }).toBeLessThan(1)
})
