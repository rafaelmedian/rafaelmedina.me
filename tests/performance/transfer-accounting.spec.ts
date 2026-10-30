import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { expect, test } from '@playwright/test'
import { recordTransfers } from './transferRecorder'

test('transfer budgets count bytes while a response is pending and after cancellation', async ({ page, context }) => {
  // Send enough of an oversized asset to exceed a small budget, then leave the
  // response unfinished. A completion-only counter incorrectly reports zero.
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Access-Control-Allow-Origin': '*' })
    response.write(Buffer.alloc(512_000, 7))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = `http://127.0.0.1:${(server.address() as AddressInfo).port}/oversized.webm`
  try {
    const client = await context.newCDPSession(page)
    await client.send('Network.enable')
    const resources = recordTransfers(client)
    await page.goto('/404.html')
    await page.evaluate(url => {
      const controller = new AbortController()
      Object.assign(window, { cancelBudgetResponse: () => controller.abort() })
      void fetch(url, { signal: controller.signal }).then(async response => {
        const reader = response.body!.getReader()
        while (!(await reader.read()).done) { /* drain received chunks */ }
      }).catch(() => undefined)
    }, address)
    const response = () => resources().find(resource => resource.url === address)
    await expect.poll(() => response()?.bytes ?? 0).toBeGreaterThan(500_000)
    await page.evaluate(() => (window as unknown as { cancelBudgetResponse: () => void }).cancelBudgetResponse())
    await expect.poll(() => response()?.failed).toBe(true)
    expect(response()!.bytes).toBeGreaterThan(500_000)
  } finally {
    server.closeAllConnections()
    await new Promise<void>(resolve => server.close(() => resolve()))
  }
})
