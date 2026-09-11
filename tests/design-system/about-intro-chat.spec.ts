import { expect, test } from '@playwright/test'

for (const width of [320, 1440]) {
  test(`B reveals a conversation and advances from email to an optional message at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toHaveCount(0)
    await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
    const chat = page.getByRole('region', { name: 'Chat with Rafa' })
    await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCSS('opacity', '1')
    await expect(chat.getByText('How are you doing?')).toBeVisible()
    const email = chat.getByRole('textbox', { name: 'Your email' })
    await expect(email).toBeVisible()
    await expect(email).not.toBeFocused()
    // Not a login: password managers stay out, and browser autofill still offers the address.
    await expect(email).toHaveAttribute('autocomplete', 'email')
    for (const [name, value] of [['data-1p-ignore', 'true'], ['data-lpignore', 'true'], ['data-bwignore', 'true'], ['data-form-type', 'other']]) {
      await expect(email).toHaveAttribute(name, value)
    }
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeVisible()
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
    await email.fill('asda@asd.')
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
    await email.fill('hello@example.com')
    await chat.getByRole('button', { name: 'Continue with email' }).click()
    await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toBeVisible()
    await expect(chat.getByText('Want to share anything else?')).toBeVisible()
    await expect(chat.getByRole('button', { name: 'Edit email address: hello@example.com' })).toHaveCSS('background-color', 'rgb(0, 113, 227)')
    await expect(chat.getByRole('img', { name: 'Loved by Rafa' })).toHaveCSS('opacity', '1')
    const message = chat.getByRole('textbox', { name: 'Your message (optional)' })
    await expect(message).toBeFocused()
    await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toHaveCount(0)
    await expect(chat.getByRole('button', { name: 'Send message' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(chat.getByRole('button', { name: 'Send message' })).toHaveAttribute('data-muted', 'true')
    const history = chat.locator('.about-intro-chat-history')
    // The follow-up's 8px entrance rise overflows for ~100ms; only the resting history must not scroll.
    await expect.poll(() => history.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(1)
    // Neither the history nor the growing reply ever draws a scrollbar.
    await expect(history).toHaveCSS('scrollbar-width', 'none')
    await expect(message).toHaveCSS('scrollbar-width', 'none')
    // Measure the resting alignment, after the portrait's hover scale settles.
    await page.mouse.move(width / 2, 100)
    await expect.poll(async () => {
      const face = await page.locator('.about-intro-surface').boundingBox()
      const hint = await chat.locator('.about-intro-chat-hint').boundingBox()
      return Math.abs(face!.y + face!.height - hint!.y - hint!.height)
    }).toBeLessThan(1)
    // Focus deepens the overlay shadow instead of drawing an inset stroke.
    expect(await message.locator('..').evaluate(node => getComputedStyle(node).boxShadow)).toContain('0px 16px 36px')
    // The message grows with its text from 88px, caps at seven lines and then scrolls.
    const fieldHeight = () => message.evaluate(node => node.getBoundingClientRect().height)
    expect(await fieldHeight()).toBe(88)
    await message.fill('One\nTwo\nThree\nFour\nFive')
    expect(await fieldHeight()).toBe(140)
    expect(await message.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(1)
    await message.fill(Array.from({ length: 20 }, (_, line) => `Line ${line + 1}`).join('\n'))
    expect(await fieldHeight()).toBe(188)
    await expect.poll(async () => {
      const face = await page.locator('.about-intro-surface').boundingBox()
      const hint = await chat.locator('.about-intro-chat-hint').boundingBox()
      return Math.abs(face!.y + face!.height - hint!.y - hint!.height)
    }).toBeLessThan(1)
    await message.fill('A little more context')
    expect(await fieldHeight()).toBe(88)
    await chat.getByRole('button', { name: 'Edit email address: hello@example.com' }).click()
    await expect(email).toBeFocused()
    await email.fill('new@example.com')
    await email.press('Enter')
    await expect(message).toHaveValue('A little more context')
    await expect(chat.getByRole('button', { name: 'Send message' })).toBeEnabled()
    await page.mouse.click(width / 2, 100)
    await expect(message).toBeVisible()
    const box = await chat.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(12)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 12)
    if (width === 320) {
      await page.setViewportSize({ width, height: 420 })
      await expect(chat.getByRole('button', { name: 'Send message' })).toBeInViewport()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('starts the comparison chat when its card comes into view and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/intro-options')
  const card = page.getByRole('region', { name: 'Chat bubble', exact: true })
  await expect(card.locator('.about-intro-chat')).toHaveAttribute('data-active', 'false')
  await card.scrollIntoViewIfNeeded()
  const chat = card.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat).toBeVisible()
  await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCSS('transform', 'none')
  await expect(chat.getByRole('textbox', { name: 'Your email' })).not.toBeFocused()
})

test('shows three typing dots before each greeting and pauses the sequence in a hidden tab', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  const typing = chat.getByRole('status', { name: 'Rafa is typing' })
  await expect(typing).toBeVisible()
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100))
  await expect(typing.locator('span')).toHaveCount(3)
  await expect.poll(async () => {
    const bubble = await typing.boundingBox()
    const face = await page.locator('.about-intro-surface').boundingBox()
    return Math.abs(bubble!.y + bubble!.height - face!.y - face!.height)
  }).toBeLessThan(1)
  await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCount(0)
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toHaveCount(0)
  await page.clock.runFor(900)
  await expect(chat.getByText('Hey, I’m Rafa.')).toBeVisible()
  await expect(typing).toBeVisible()
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.runFor(3000)
  await expect(page.locator('.about-intro-chat').getByText('How are you doing?', { exact: true })).toHaveCount(0)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.runFor(900)
  await expect(chat.getByText('How are you doing?')).toBeVisible()
  await page.clock.runFor(900)
  await expect(typing).toHaveCount(0)
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  await expect.poll(async () => {
    const question = await chat.getByText('Wanna share your email with me so I can reach out to you?').boundingBox()
    const field = await chat.locator('form').boundingBox()
    return Math.abs(field!.y - question!.y - question!.height - 8)
  }).toBeLessThan(1)
  // The field is the visitor's: right-aligned where the sent address lands, with
  // the sent bubble's tail on the right, and no tail left on the question.
  expect(await chat.getByText('Wanna share your email with me so I can reach out to you?').evaluate(node => getComputedStyle(node, '::before').content)).toBe('none')
  const form = chat.locator('form')
  expect(await form.evaluate(node => [getComputedStyle(node, '::after').content, getComputedStyle(node, '::after').right])).toEqual(['""', '-8px'])
  const chatBox = await chat.boundingBox()
  const formBox = await form.boundingBox()
  expect(Math.abs(chatBox!.x + chatBox!.width - formBox!.x - formBox!.width)).toBeLessThan(1)
})


test('sends from the website, preserves failed messages and reuses the retry key', async ({ page }) => {
  const payloads: { email: string; message: string; requestId: string }[] = []
  await page.route('http://127.0.0.1:8788/contact', async route => {
    payloads.push(route.request().postDataJSON())
    const success = payloads.length > 1
    await route.fulfill({ status: success ? 202 : 502, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(success ? { sent: true } : { error: 'Couldn’t send. Please retry.' }) })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  expect(payloads).toHaveLength(0)
  const message = chat.getByRole('textbox', { name: 'Your message (optional)' })
  await message.fill('Let’s build something')
  await chat.getByRole('button', { name: 'Send message' }).click()
  await expect(chat.getByText('Couldn’t send. Please retry.')).toBeVisible()
  await expect(message).toHaveValue('Let’s build something')
  await chat.getByRole('button', { name: 'Retry message' }).click()
  await expect(chat.getByText('Sent. Thanks for saying hello!')).toBeVisible()
  await expect(chat.getByRole('button', { name: 'Send message' })).toBeDisabled()
  expect(payloads).toHaveLength(2)
  expect(payloads[0]).toEqual(payloads[1])
  expect(payloads[0].email).toBe('visitor@example.com')
  expect(new URL(page.url()).pathname).toBe('/')
})
