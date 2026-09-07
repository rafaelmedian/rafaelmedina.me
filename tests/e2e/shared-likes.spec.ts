import { expect, test } from "@playwright/test"

test("concurrent retries count each visitor once and repeated unlikes never subtract other likes", async ({ request }) => {
  const endpoint = "http://127.0.0.1:8787/notes/building-a-dark-theme/likes"
  const headersA = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": crypto.randomUUID() }
  const headersB = { ...headersA, "X-Visitor-ID": crypto.randomUUID() }
  const before = await request.get(endpoint, { headers: headersA })
  expect(before.ok()).toBe(true)
  const initial = (await before.json()).count
  try {
    const responses = await Promise.all([
      ...Array.from({ length: 5 }, () => request.put(endpoint, { headers: headersA, data: { liked: true } })),
      request.put(endpoint, { headers: headersB, data: { liked: true } }),
    ])
    for (const response of responses) expect(response.ok()).toBe(true)
    expect(await (await request.get(endpoint, { headers: headersA })).json()).toEqual({ count: initial + 2, liked: true })
    for (let i = 0; i < 3; i++) {
      const response = await request.put(endpoint, { headers: headersA, data: { liked: false } })
      expect(await response.json()).toEqual({ count: initial + 1, liked: false })
    }
    expect(await (await request.get(endpoint, { headers: headersB })).json()).toEqual({ count: initial + 1, liked: true })
  } finally {
    await request.put(endpoint, { headers: headersA, data: { liked: false } })
    await request.put(endpoint, { headers: headersB, data: { liked: false } })
  }
})

test("likes API rejects unknown notes, invalid visitors, foreign origins and malformed writes", async ({ request }) => {
  const endpoint = "http://127.0.0.1:8787/notes/designing-matcha/likes"
  const headers = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": crypto.randomUUID() }
  expect((await request.get(endpoint.replace("designing-matcha", "not-a-note"), { headers })).status()).toBe(404)
  expect((await request.get(endpoint, { headers: { ...headers, "X-Visitor-ID": "invalid" } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers: { ...headers, Origin: "https://example.com" }, data: { liked: true } })).status()).toBe(403)
  expect((await request.put(endpoint, { headers, data: { liked: "true" } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers, data: { liked: true, padding: "x".repeat(300) } })).status()).toBe(413)
  const preflight = await request.fetch(endpoint, { method: "OPTIONS", headers })
  expect(preflight.status()).toBe(204)
  expect(preflight.headers()["access-control-allow-origin"]).toBe(headers.Origin)
})
